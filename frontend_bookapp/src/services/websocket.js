import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketClient {
    constructor() {
        this.client = null;
        this.connected = false;
        this.subscriptions = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
    }

    connect(onConnected, onError) {
        const API_BASE = import.meta.env.VITE_API_BASE || 'https://bookapp-production-3e11.up.railway.app';
        const WS_URL = `${API_BASE}/ws`;

        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: this.reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log('[WebSocket]', str);
            },
            onConnect: () => {
                console.log('✅ WebSocket Connected');
                this.connected = true;
                this.reconnectAttempts = 0;
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('❌ WebSocket Error:', frame.headers['message']);
                console.error('Details:', frame.body);
                this.connected = false;
                if (onError) onError(frame);
            },
            onWebSocketClose: () => {
                console.log('🔌 WebSocket Disconnected');
                this.connected = false;
                this.handleReconnect(onConnected, onError);
            },
        });

        this.client.activate();
    }

    handleReconnect(onConnected, onError) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect(onConnected, onError);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Max reconnection attempts reached');
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.connected) {
            console.warn('⚠️ WebSocket not connected. Subscription will be queued.');
            // Queue subscription for when connection is established
            setTimeout(() => this.subscribe(destination, callback), 1000);
            return null;
        }

        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const data = JSON.parse(message.body);
                callback(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });

        this.subscriptions.set(destination, subscription);
        console.log(`📡 Subscribed to: ${destination}`);
        return subscription;
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
            console.log(`🔕 Unsubscribed from: ${destination}`);
        }
    }

    disconnect() {
        if (this.client) {
            // Unsubscribe from all
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
            this.subscriptions.clear();

            this.client.deactivate();
            this.connected = false;
            console.log('👋 WebSocket Disconnected');
        }
    }

    isConnected() {
        return this.connected;
    }
}

// Singleton instance
const wsClient = new WebSocketClient();

export default wsClient;
