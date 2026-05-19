import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service';
import { AuthService, User } from '../services/auth.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  isError?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: 'Inter', sans-serif;
    }
    .chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .chat-toggle:hover {
      transform: scale(1.05);
    }
    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    .chat-header {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 15px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-body {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
      background: #f9fafb;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .message.user {
      align-self: flex-end;
      background: #6366f1;
      color: white;
      border-bottom-right-radius: 2px;
    }
    .message.bot {
      align-self: flex-start;
      background: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 2px;
    }
    .message.error-msg {
      background: #fee2e2;
      color: #b91c1c;
      border-color: #f87171;
    }
    .suggestions {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    .suggestion-btn {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 5px 10px;
      font-size: 0.8rem;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.2s;
    }
    .suggestion-btn:hover {
      background: #e5e7eb;
      color: #1f2937;
    }
    .chat-footer {
      padding: 10px;
      background: white;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .chat-input {
      flex: 1;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      outline: none;
      font-size: 0.9rem;
    }
    .chat-input:focus {
      border-color: #6366f1;
    }
    .send-btn {
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .report-btn {
      background: none;
      border: none;
      color: white;
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  inputMessage = '';
  currentUser: User | null = null;
  isLoading = false;

  plannerSuggestions = [
    "Nazım planı nasıl yapılır?",
    "Dönüm başına ortalama plan ücreti nedir?",
    "Planlama mevzuatı özetle"
  ];

  entitySuggestions = [
    "Plan onay süreçleri nelerdir?",
    "İmar planı değişikliği için gerekli belgeler",
    "En iyi şehir plancısı nasıl seçilir?"
  ];

  suggestions: string[] = [];

  constructor(
    private chatbotService: ChatbotService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.role === 'ROLE_PLANNER') {
        this.suggestions = this.plannerSuggestions;
      } else if (user?.role === 'ROLE_ENTITY') {
        this.suggestions = this.entitySuggestions;
      } else {
        this.suggestions = [];
      }
    });

    this.messages.push({ text: 'Merhaba! Size nasıl yardımcı olabilirim?', isUser: false });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  useSuggestion(suggestion: string) {
    this.inputMessage = suggestion;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.inputMessage.trim()) return;

    const userText = this.inputMessage;
    this.messages.push({ text: userText, isUser: true });
    this.inputMessage = '';
    this.isLoading = true;

    this.chatbotService.sendMessage(userText, this.currentUser?.id).subscribe({
      next: (res) => {
        this.messages.push({ text: res.response, isUser: false });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({ text: 'AI servisine ulaşılamadı. Lütfen daha sonra tekrar deneyin.', isUser: false, isError: true });
        this.isLoading = false;
      }
    });
  }

  reportError() {
    if (!this.currentUser) {
      alert('Hata bildirmek için giriş yapmalısınız.');
      return;
    }
    const contextText = this.messages.slice(-3).map(m => (m.isUser ? 'Kullanıcı: ' : 'Bot: ') + m.text).join('\n');
    
    this.chatbotService.reportError('Sohbet üzerinden bildirilen hata: \n' + contextText, this.currentUser.id).subscribe({
      next: () => {
        alert('Hata başarıyla bildirildi!');
      },
      error: () => {
        alert('Hata bildirilirken bir sorun oluştu.');
      }
    });
  }
}
