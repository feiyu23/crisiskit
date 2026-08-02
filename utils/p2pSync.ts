import { Incident } from '../types';

export interface PeerMessage {
  type: 'SYNC_INCIDENTS' | 'PING' | 'PONG';
  timestamp: number;
  incidents?: Incident[];
}

export class P2PSyncManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private onIncidentsReceivedCallback: ((incidents: Incident[]) => void) | null = null;
  private onConnectionStateChangeCallback: ((state: string) => void) | null = null;

  constructor() {
    const config: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    try {
      this.peerConnection = new RTCPeerConnection(config);
      this.setupPeerEvents();
    } catch (e) {
      console.warn('WebRTC not fully supported or blocked in this environment:', e);
    }
  }

  private setupPeerEvents() {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection && this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannelEvents();
    };
  }

  private setupDataChannelEvents() {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      if (this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback('connected');
      }
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const msg: PeerMessage = JSON.parse(event.data);
        if (msg.type === 'SYNC_INCIDENTS' && msg.incidents && this.onIncidentsReceivedCallback) {
          this.onIncidentsReceivedCallback(msg.incidents);
        }
      } catch (e) {
        console.error('Failed to parse peer message:', e);
      }
    };
  }

  public async createOfferToken(): Promise<string> {
    if (!this.peerConnection) throw new Error('PeerConnection not initialized');

    this.dataChannel = this.peerConnection.createDataChannel('crisiskit-sync');
    this.setupDataChannelEvents();

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    await new Promise<void>((resolve) => {
      if (this.peerConnection?.iceGatheringState === 'complete') {
        resolve();
      } else {
        const checkState = () => {
          if (this.peerConnection?.iceGatheringState === 'complete') {
            this.peerConnection.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        };
        this.peerConnection?.addEventListener('icegatheringstatechange', checkState);
        setTimeout(resolve, 1000);
      }
    });

    const desc = this.peerConnection.localDescription;
    return btoa(JSON.stringify(desc));
  }

  public async acceptOfferToken(offerToken: string): Promise<string> {
    if (!this.peerConnection) throw new Error('PeerConnection not initialized');

    const desc = JSON.parse(atob(offerToken));
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(desc));

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    await new Promise<void>((resolve) => {
      if (this.peerConnection?.iceGatheringState === 'complete') {
        resolve();
      } else {
        const checkState = () => {
          if (this.peerConnection?.iceGatheringState === 'complete') {
            this.peerConnection.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        };
        this.peerConnection?.addEventListener('icegatheringstatechange', checkState);
        setTimeout(resolve, 1000);
      }
    });

    const answerDesc = this.peerConnection.localDescription;
    return btoa(JSON.stringify(answerDesc));
  }

  public async acceptAnswerToken(answerToken: string): Promise<void> {
    if (!this.peerConnection) throw new Error('PeerConnection not initialized');
    const desc = JSON.parse(atob(answerToken));
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
  }

  public sendIncidents(incidents: Incident[]): boolean {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const msg: PeerMessage = {
        type: 'SYNC_INCIDENTS',
        timestamp: Date.now(),
        incidents
      };
      this.dataChannel.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }

  public onIncidentsReceived(cb: (incidents: Incident[]) => void) {
    this.onIncidentsReceivedCallback = cb;
  }

  public onConnectionStateChange(cb: (state: string) => void) {
    this.onConnectionStateChangeCallback = cb;
  }

  public close() {
    if (this.dataChannel) this.dataChannel.close();
    if (this.peerConnection) this.peerConnection.close();
  }
}
