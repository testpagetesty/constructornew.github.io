// Live Chat Export Logic - uses only LiveChatEditor data

// Function to generate live chat HTML structure
export const generateLiveChatHTML = (siteName = 'My Site', languageCode = 'en', liveChatData = {}) => {
  console.log('🚀 generateLiveChatHTML called with:', {
    siteName,
    languageCode,
    liveChatData: {
      enabled: liveChatData.enabled,
      selectedResponses: liveChatData.selectedResponses ? 'Present' : 'Missing',
      allTranslations: liveChatData.allTranslations ? 'Present' : 'Missing'
    }
  });
  
  let welcomeMessage = `Hello! I'm a virtual assistant from ${siteName}. How can I help you? 👋`;
  let placeholder = 'Type your message...';
  let statusMessage = '💡 For further assistance, please fill out the form on the website';
  const fallbackTranslations = {
    welcomeMessage: {
      ru: `Привет! Я виртуальный помощник ${siteName}. Как могу помочь вам сегодня? 👋`,
      en: `Hello! I'm a virtual assistant from ${siteName}. How can I help you? 👋`,
      es: `¡Hola! Soy un asistente virtual de ${siteName}. ¿Cómo puedo ayudarles? 👋`,
      tr: `Merhaba! Ben ${siteName} sanal asistanıyım. Size nasıl yardımcı olabilirim? 👋`,
      de: `Hallo! Ich bin ein virtueller Assistent von ${siteName}. Wie kann ich Ihnen helfen? 👋`,
      it: `Ciao! Sono un assistente virtuale di ${siteName}. Come posso aiutarvi? 👋`,
      pt: `Olá! Sou um assistente virtual da ${siteName}. Como posso ajudá-los? 👋`,
      nl: `Hallo! Ik ben een virtuele assistent van ${siteName}. Hoe kan ik u helpen? 👋`,
      ja: `こんにちは！私は${siteName}のバーチャルアシスタントです。どのようにお手伝いできますか？👋`,
      ko: `안녕하세요! 저는 ${siteName}의 가상 어시스턴트입니다. 어떻게 도와드릴까요? 👋`,
      he: `שלום! אני עוזר וירטואלי של ${siteName}. איך אני יכול לעזור לכם? 👋`,
      hi: `नमस्ते! मैं ${siteName} का वर्चुअल असिस्टेंट हूं। मैं आपकी कैसे मदद कर सकता हूं? 👋`,
      uk: `Привіт! Я віртуальний помічник ${siteName}. Як можу допомогти? 👋`,
      zh: `很高兴您联系我们！😊 我是${siteName}的虚拟助手。我能为您做些什么吗？👋`,
      ar: `مرحباً! أنا المساعد الافتراضي لـ ${siteName}. كيف يمكنني مساعدتكم؟ 👋`,
      fr: `Bonjour ! Je suis un assistant virtuel de ${siteName}. Comment puis-je vous aider ? 👋`,
      pl: `Cześć! Jestem wirtualnym asystentem z ${siteName}. Jak mogę Wam pomóc? 👋`,
      cs: `Ahoj! Jsem virtuální asistent ${siteName}. Jak vám mohu pomoci? 👋`,
      da: `Hej! Jeg er en virtuel assistent fra ${siteName}. Hvordan kan jeg hjælpe jer? 👋`,
      fi: `Hei! Olen ${siteName}:n virtuaalinen assistentti. Kuinka voin auttaa teitä? 👋`,
      el: `Γεια σας! Είμαι ο εικονικός βοηθός της ${siteName}. Πώς μπορώ να σας βοηθήσω; 👋`,
      hu: `Szia! A ${siteName} virtuális asszisztense vagyok. Hogyan segíthetek? 👋`,
      no: `Hei! Jeg er en virtuell assistent fra ${siteName}. Hvordan kan jeg hjelpe dere? 👋`,
      ro: `Salut! Sunt asistentul virtual al ${siteName}. Cum vă pot ajuta? 👋`,
      sv: `Hej! Jag är en virtuell assistent från ${siteName}. Hur kan jag hjälpa er? 👋`,
      th: `สวัสดี! ฉันเป็นผู้ช่วยเสมือนของ ${siteName} ฉันสามารถช่วยคุณได้อย่างไร? 👋`,
      vi: `Xin chào! Tôi là trợ lý ảo của ${siteName}. Tôi có thể giúp gì cho bạn? 👋`,
      bg: `Здравейте! Аз съм виртуалният асистент на ${siteName}. Как мога да ви помогна? 👋`,
      sr: `Здраво! Ја сам виртуални асистент ${siteName}. Како могу да вам помогнем? 👋`,
      sk: `Ahoj! Som virtuálny asistent ${siteName}. Ako vám môžem pomôcť? 👋`,
      sl: `Pozdravljeni! Sem virtualni asistent ${siteName}. Kako vam lahko pomagam? 👋`
    },
    placeholder: {
      ru: 'Введите ваше сообщение...',
      en: 'Type your message...',
      es: 'Escriban su mensaje...',
      tr: 'Mesajınızı yazın...',
      de: 'Schreiben Sie Ihre Nachricht...',
      it: 'Scrivete il vostro messaggio...',
      pt: 'Digite sua mensagem...',
      nl: 'Typ uw bericht...',
      ja: 'メッセージを入力してください...',
      ko: '메시지를 입력하세요...',
      he: 'הקלידו את ההודעה שלכם...',
      hi: 'अपना संदेश टाइप करें...',
      uk: 'Напишіть ваше повідомлення...',
      zh: '请输入您的消息...',
      ar: 'اكتبوا رسالتكم...',
      fr: 'Tapez votre message...',
      pl: 'Napisz swoją wiadomość...',
      cs: 'Napište svou zprávu...',
      da: 'Skriv jeres besked...',
      fi: 'Kirjoita viestisi...',
      el: 'Γράψτε το μήνυμά σας...',
      hu: 'Írja be üzenetét...',
      no: 'Skriv deres melding...',
      ro: 'Scrieți mesajul vostru...',
      sv: 'Skriv ert meddelande...',
      th: 'พิมพ์ข้อความของคุณ...',
      vi: 'Nhập tin nhắn của bạn...',
      bg: 'Напишете вашето съобщение...',
      sr: 'Напишите вашу поруку...',
      sk: 'Napíšte svoju správu...',
      sl: 'Napišite svoje sporočilo...'
    },
    statusMessage: {
      ru: '💡 За дополнительной помощью, пожалуйста, заполните форму на сайте',
      en: '💡 For further assistance, please fill out the form on the website',
      es: '💡 Para más ayuda, por favor completen el formulario en el sitio web',
      tr: '💡 Daha fazla yardım için lütfen web sitesindeki formu doldurun',
      de: '💡 Für weitere Hilfe füllen Sie bitte das Formular auf der Website aus',
      it: '💡 Per ulteriore assistenza, compilate il modulo sul sito web',
      pt: '💡 Para mais assistência, por favor preencham o formulário no site',
      nl: '💡 Voor verdere assistentie, vul het formulier op de website in',
      ja: '💡 さらなるサポートについては、ウェブサイトのフォームにご記入ください',
      ko: '💡 추가 지원을 위해 웹사이트의 양식을 작성해 주세요',
      he: '💡 לעזרה נוספת, אנא מלאו את הטופס באתר',
      hi: '💡 और सहायता के लिए, कृपया वेबसाइट पर फॉर्म भरें',
      uk: '💡 Для подальшої допомоги заповніть форму на сайті',
      zh: '💡 如需进一步帮助，请填写网站上的表格',
      ar: '💡 للمساعدة الإضافية، يرجى ملء النموذج على الموقع',
      fr: '💡 Pour plus d\'aide, veuillez remplir le formulaire sur le site web',
      pl: '💡 Aby uzyskać dalszą pomoc, wypełnij formularz na stronie internetowej',
      cs: '💡 Pro další pomoc vyplňte prosím formulář na webových stránkách',
      da: '💡 For yderligere hjælp, udfyld venligst formularen på hjemmesiden',
      fi: '💡 Lisäavun saamiseksi täyttäkää lomake verkkosivustolla',
      el: '💡 Για περαιτέρω βοήθεια, παρακαλώ συμπληρώστε τη φόρμα στον ιστότοπο',
      hu: '💡 További segítségért kérjük töltse ki az űrlapot a weboldalon',
      no: '💡 For ytterligere hjelp, vennligst fyll ut skjemaet på nettsiden',
      ro: '💡 Pentru asistență suplimentară, vă rugăm să completați formularul de pe site',
      sv: '💡 För ytterligare hjälp, vänligen fyll i formuläret på webbplatsen',
      th: '💡 สำหรับความช่วยเหลือเพิ่มเติม กรุณากรอกแบบฟอร์มในเว็บไซต์',
      vi: '💡 Để được hỗ trợ thêm, vui lòng điền vào biểu mẫu trên trang web',
      bg: '💡 За допълнителна помощ, моля попълнете формата на уебсайта',
      sr: '💡 За додатну помоћ, молимо попуните формулар на веб сајту',
      sk: '💡 Pre ďalšiu pomoc vyplňte prosím formulár na webovej stránke',
      sl: '💡 Za nadaljnjo pomoč izpolnite obrazec na spletnem mestu'
    }
  };
  
  if (liveChatData.allTranslations && liveChatData.allTranslations.trim()) {
    try {
      const allTranslations = typeof liveChatData.allTranslations === 'string' 
        ? JSON.parse(liveChatData.allTranslations) 
        : liveChatData.allTranslations;
      

      if (allTranslations.welcomeMessage && allTranslations.welcomeMessage[languageCode]) {
        welcomeMessage = allTranslations.welcomeMessage[languageCode].replace('{siteName}', siteName);
        console.log('✅ Using welcomeMessage from LiveChatEditor');
      } else if (fallbackTranslations.welcomeMessage[languageCode]) {
        welcomeMessage = fallbackTranslations.welcomeMessage[languageCode];
        console.log('⚠️ Using fallback welcomeMessage for', languageCode);
      }
      
      if (allTranslations.placeholder && allTranslations.placeholder[languageCode]) {
        placeholder = allTranslations.placeholder[languageCode];
        console.log('✅ Using placeholder from LiveChatEditor');
      } else if (fallbackTranslations.placeholder[languageCode]) {
        placeholder = fallbackTranslations.placeholder[languageCode];
        console.log('⚠️ Using fallback placeholder for', languageCode);
      }
      
      if (allTranslations.statusMessage && allTranslations.statusMessage[languageCode]) {
        statusMessage = allTranslations.statusMessage[languageCode];
        console.log('✅ Using statusMessage from LiveChatEditor');
      } else if (fallbackTranslations.statusMessage[languageCode]) {
        statusMessage = fallbackTranslations.statusMessage[languageCode];
        console.log('⚠️ Using fallback statusMessage for', languageCode);
      }
      
      console.log('✅ Using translations from LiveChatEditor for HTML');
    } catch (error) {
      console.warn('⚠️ Error parsing allTranslations for HTML, using fallbacks:', error);

      if (fallbackTranslations.welcomeMessage[languageCode]) {
        welcomeMessage = fallbackTranslations.welcomeMessage[languageCode];
      }
      if (fallbackTranslations.placeholder[languageCode]) {
        placeholder = fallbackTranslations.placeholder[languageCode];
      }
      if (fallbackTranslations.statusMessage[languageCode]) {
        statusMessage = fallbackTranslations.statusMessage[languageCode];
      }
    }
  } else {
    console.log('⚠️ No allTranslations data, using fallback translations for', languageCode);

    if (fallbackTranslations.welcomeMessage[languageCode]) {
      welcomeMessage = fallbackTranslations.welcomeMessage[languageCode];
    }
    if (fallbackTranslations.placeholder[languageCode]) {
      placeholder = fallbackTranslations.placeholder[languageCode];
    }
    if (fallbackTranslations.statusMessage[languageCode]) {
      statusMessage = fallbackTranslations.statusMessage[languageCode];
    }
  }
  
  console.log('📤 Final HTML texts:', { welcomeMessage, placeholder, statusMessage });

  return `<!-- Live Chat Widget -->
    <div id="liveChatWidget" class="live-chat-widget">
      <button id="chatToggle" class="chat-toggle" aria-label="Open chat">
        <svg class="chat-icon" viewBox="0 0 24 24" width="28" height="28">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          <circle cx="7" cy="10" r="1.5" fill="rgba(255,255,255,0.9)"/>
          <circle cx="12" cy="10" r="1.5" fill="rgba(255,255,255,0.9)"/>
          <circle cx="17" cy="10" r="1.5" fill="rgba(255,255,255,0.9)"/>
        </svg>
        <div class="chat-pulse-ring"></div>
        <svg class="close-icon hidden" viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
      <div id="chatWindow" class="chat-window hidden">
                  <div class="chat-header">
            <div class="header-info">
            <span class="header-title" data-header-title>${siteName}</span>
            </div>
          <button id="chatClose" class="chat-close-btn" aria-label="Close chat">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        <div id="messagesContainer" class="messages-container">
          <div class="message bot-message">
            <div class="message-avatar operator"></div>
            <div class="message-bubble">
              <div class="message-text" data-welcome-message>${welcomeMessage}</div>
              <div class="message-time">${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</div>
            </div>
          </div>
          <div id="loadingIndicator" class="message bot-message hidden">
            <div class="message-avatar operator"></div>
            <div class="message-bubble">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea id="messageInput" class="message-input" placeholder="${placeholder}" rows="1" data-input-placeholder></textarea>
          <button id="sendButton" class="send-button" disabled aria-label="Send">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
            </svg>
          </button>
        </div>
        <div id="chatStatus" class="chat-status hidden">
          ${statusMessage}
        </div>
      </div>
    </div>`;
};


export const generateLiveChatCSS = () => {
  return `.live-chat-widget{position:fixed;bottom:20px;right:20px;z-index:9999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;opacity:1;visibility:visible}.chat-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(3px);z-index:9998;opacity:0;visibility:hidden;transition:all 0.3s ease}.chat-backdrop.active{opacity:1;visibility:visible}.chat-toggle{width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#2196F3 0%,#1976D2 50%,#0D47A1 100%);border:none;box-shadow:0 8px 25px rgba(33,150,243,0.4),0 0 20px rgba(25,118,210,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;transition:all 0.3s ease;position:relative;border:3px solid rgba(255,255,255,0.2)}.chat-toggle:hover{transform:scale(1.08);box-shadow:0 12px 35px rgba(33,150,243,0.6),0 0 30px rgba(25,118,210,0.5)}.chat-toggle .chat-icon,.chat-toggle .close-icon{transition:all 0.3s ease;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))}.chat-pulse-ring{position:absolute;width:100%;height:100%;border:2px solid rgba(33,150,243,0.6);border-radius:50%;animation:pulse-ring 2s infinite ease-out;top:50%;left:50%;transform:translate(-50%,-50%)}.chat-toggle.has-new-message .chat-pulse-ring{animation:pulse-ring 1s infinite ease-out}@keyframes pulse-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:0.8}50%{transform:translate(-50%,-50%) scale(1.2);opacity:0.4}100%{transform:translate(-50%,-50%) scale(1.4);opacity:0}}.hidden{display:none!important}.chat-window{position:absolute;bottom:85px;right:0;width:400px;height:580px;background:linear-gradient(145deg,#ffffff 0%,#f8fafc 50%,#f1f5f9 100%);border-radius:24px;box-shadow:0 25px 80px rgba(0,0,0,0.15),0 0 60px rgba(33,150,243,0.1),inset 0 1px 0 rgba(255,255,255,0.8);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(33,150,243,0.1);background-clip:padding-box;animation:slideUpModern 0.4s cubic-bezier(0.4,0,0.2,1);backdrop-filter:blur(20px)}@keyframes slideUpModern{from{transform:translateY(30px) scale(0.9)}to{transform:translateY(0) scale(1)}}.chat-window::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;border-radius:20px;padding:2px;background:linear-gradient(45deg,#667eea,#764ba2,#f093fb,#f5576c,#4facfe,#00f2fe);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;z-index:-1}.chat-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px;display:flex;align-items:center;justify-content:space-between;position:relative}.chat-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)}.header-info{display:flex;align-items:center;gap:10px}.header-title{font-weight:700;font-size:17px;text-shadow:0 2px 4px rgba(0,0,0,0.3)}.chat-close-btn{background:rgba(255,255,255,0.1);border:none;color:white;cursor:pointer;padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;backdrop-filter:blur(10px)}.chat-close-btn:hover{background:rgba(255,255,255,0.2);transform:scale(1.1)}.messages-container{flex:1;overflow-y:auto;padding:20px;background:rgba(255,255,255,0.05);display:flex;flex-direction:column;gap:15px;backdrop-filter:blur(5px)}.message{display:flex;align-items:flex-start;gap:10px;animation:messageSlide 0.3s ease-out}@keyframes messageSlide{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.message.user-message{flex-direction:row-reverse}.message-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 12px rgba(102,126,234,0.3);font-weight:bold;font-size:14px;overflow:hidden}.message-avatar.operator{background-image:url('assets/images/operator.jpg');background-size:cover;background-position:center;background-repeat:no-repeat;border:2px solid rgba(102,126,234,0.5)}.user-message .message-avatar{background:linear-gradient(135deg,#f093fb,#f5576c)}.message-bubble{background:rgba(255,255,255,0.95);padding:15px 20px;border-radius:20px;max-width:75%;box-shadow:0 4px 15px rgba(0,0,0,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2)}.user-message .message-bubble{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-bottom-right-radius:6px;box-shadow:0 4px 15px rgba(102,126,234,0.3)}.bot-message .message-bubble{border-bottom-left-radius:6px}.message-text{font-size:15px;line-height:1.5;word-wrap:break-word;font-weight:500}.message-time{font-size:12px;opacity:0.7;margin-top:6px;font-weight:400}.chat-input-container{padding:20px;background:rgba(255,255,255,0.08);border-top:1px solid rgba(255,255,255,0.1);display:flex;gap:12px;align-items:flex-end;backdrop-filter:blur(10px)}.message-input{flex:1;border:2px solid rgba(255,255,255,0.2);border-radius:25px;padding:16px 22px;font-size:15px;resize:none;font-family:inherit;outline:none;max-height:140px;min-height:52px;background:rgba(255,255,255,0.95);color:#333;transition:all 0.3s ease;backdrop-filter:blur(5px);line-height:1.4}.message-input:focus{border-color:#667eea;box-shadow:0 0 20px rgba(102,126,234,0.3);background:rgba(255,255,255,1)}.message-input::placeholder{color:#888;font-weight:400}.send-button{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;flex-shrink:0;box-shadow:0 6px 20px rgba(102,126,234,0.4)}.send-button:hover:not(:disabled){transform:scale(1.1);box-shadow:0 8px 25px rgba(102,126,234,0.6)}.send-button:disabled{background:linear-gradient(135deg,#ccc,#999);cursor:not-allowed;transform:none;box-shadow:none}.typing-indicator{display:flex;gap:6px;align-items:center;padding:10px 0}.typing-indicator span{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);animation:typingNeon 1.4s infinite ease-in-out;box-shadow:0 2px 8px rgba(102,126,234,0.4)}.typing-indicator span:nth-child(1){animation-delay:-0.32s}.typing-indicator span:nth-child(2){animation-delay:-0.16s}@keyframes typingNeon{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}.chat-status{padding:12px 20px;background:rgba(33,150,243,0.1);color:#1976d2;text-align:center;font-size:13px;font-weight:500;border-top:1px solid rgba(33,150,243,0.2)}@media (max-width:480px){.live-chat-widget{right:15px;bottom:15px}.chat-window{width:calc(100vw - 30px);right:-15px;height:480px}.chat-toggle{width:60px;height:60px}}.messages-container::-webkit-scrollbar{width:8px}.messages-container::-webkit-scrollbar-track{background:rgba(255,255,255,0.1);border-radius:4px}.messages-container::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#667eea,#764ba2);border-radius:4px;box-shadow:0 2px 8px rgba(102,126,234,0.3)}.messages-container::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#764ba2,#667eea)}.chat-window[dir="rtl"]{direction:rtl}.chat-window[dir="rtl"] .chat-header{flex-direction:row-reverse}.chat-window[dir="rtl"] .header-info{flex-direction:row-reverse}.chat-window[dir="rtl"] .message{text-align:right}.chat-window[dir="rtl"] .message.user-message{flex-direction:row}.chat-window[dir="rtl"] .message.bot-message{flex-direction:row-reverse}.chat-window[dir="rtl"] .chat-input-container{flex-direction:row-reverse}.chat-window[dir="rtl"] .message-input{text-align:right}`;
};


export const generateLiveChatJS = (siteName = 'My Site', languageCode = 'en', liveChatData = {}) => {
  console.log('🚀 generateLiveChatJS called with:', {
    siteName,
    languageCode,
    liveChatData: {
      enabled: liveChatData.enabled,
      selectedResponses: liveChatData.selectedResponses ? 'Present' : 'Missing',
      allTranslations: liveChatData.allTranslations ? 'Present' : 'Missing'
    }
  });
  

  let responses = ['Thank you for your question!', 'Of course! Tell me more details.', 'Great question!', 'I understand your situation.', 'This is an important topic.'];
  

  const fallbackResponses = {
    ru: ['Спасибо за ваш вопрос!', 'Конечно! Расскажите больше деталей.', 'Отличный вопрос!', 'Я понимаю вашу ситуацию.', 'Это важная тема.'],
    en: ['Thank you for your question!', 'Of course! Tell me more details.', 'Great question!', 'I understand your situation.', 'This is an important topic.'],
    es: ['¡Gracias por su pregunta!', '¡Por supuesto! Cuéntenme más detalles.', '¡Excelente pregunta!', 'Entiendo su situación.', 'Este es un tema importante.'],
    tr: ['Sorunuz için teşekkürler!', 'Tabii ki! Daha fazla ayrıntı anlatın.', 'Harika soru!', 'Durumunuzu anlıyorum.', 'Bu önemli bir konu.'],
    de: ['Danke für Ihre Frage!', 'Natürlich! Erzählen Sie mir mehr Details.', 'Großartige Frage!', 'Ich verstehe Ihre Situation.', 'Das ist ein wichtiges Thema.'],
    it: ['Grazie per la vostra domanda!', 'Certamente! Raccontatemi più dettagli.', 'Ottima domanda!', 'Capisco la vostra situazione.', 'Questo è un argomento importante.'],
    pt: ['Obrigado pela sua pergunta!', 'Claro! Contem-me mais detalhes.', 'Ótima pergunta!', 'Entendo a sua situação.', 'Este é um tópico importante.'],
    nl: ['Bedankt voor uw vraag!', 'Natuurlijk! Vertel me meer details.', 'Geweldige vraag!', 'Ik begrijp uw situatie.', 'Dit is een belangrijk onderwerp.'],
    ja: ['ご質問ありがとうございます！', 'もちろんです！詳細を教えてください。', '素晴らしい質問ですね！', 'あなたの状況を理解しています。', 'これは重要なトピックです。'],
    ko: ['질문해 주셔서 감사합니다!', '물론입니다! 자세한 내용을 알려주세요.', '훌륭한 질문이네요!', '상황을 이해합니다.', '이것은 중요한 주제입니다.'],
    he: ['תודה על השאלה שלכם!', 'בוודאי! ספרו לי יותר פרטים.', 'שאלה מעולה!', 'אני מבין את המצב שלכם.', 'זה נושא חשוב.'],
    hi: ['आपके प्रश्न के लिए धन्यवाद!', 'बिल्कुल! मुझे और विवरण बताएं।', 'बेहतरीन सवाल!', 'मैं आपकी स्थिति समझता हूं।', 'यह एक महत्वपूर्ण विषय है।'],
    uk: ['Дякую за ваше питання!', 'Звичайно! Розкажіть більше деталей.', 'Відмінне питання!', 'Я розумію вашу ситуацію.', 'Це важлива тема.'],
    zh: ['很高兴您联系我们！😊 我们的专家已经在处理您的问题了。', '感谢您的留言！我们珍视您的信任，一定会帮助您。', '太好了！您的请求已被接受。我们的专家团队正在加紧回复！⚡', '感谢您的联系！我们已经安排专家来解决您的问题。', '太棒了！我们已收到您的消息。专家们正在分析情况。🔍'],
    ar: ['شكراً لكم على سؤالكم!', 'بالطبع! أخبروني بالمزيد من التفاصيل.', 'سؤال ممتاز!', 'أفهم موقفكم.', 'هذا موضوع مهم.'],
    fr: ['Merci pour votre question !', 'Bien sûr ! Dites-moi plus de détails.', 'Excellente question !', 'Je comprends votre situation.', 'C\'est un sujet important.'],
    pl: ['Dziękuję za pytanie!', 'Oczywiście! Opowiedz mi więcej szczegółów.', 'Świetne pytanie!', 'Rozumiem twoją sytuację.', 'To ważny temat.'],
    cs: ['Děkuji za vaši otázku!', 'Samozřejmě! Řekněte mi více podrobností.', 'Skvělá otázka!', 'Rozumím vaší situaci.', 'To je důležité téma.'],
    da: ['Tak for jeres spørgsmål!', 'Selvfølgelig! Fortæl mig flere detaljer.', 'Fantastisk spørgsmål!', 'Jeg forstår jeres situation.', 'Det er et vigtigt emne.'],
    fi: ['Kiitos kysymyksestänne!', 'Tietysti! Kertokaa minulle lisää yksityiskohtia.', 'Loistava kysymys!', 'Ymmärrän tilanteenne.', 'Tämä on tärkeä aihe.'],
    el: ['Ευχαριστώ για την ερώτησή σας!', 'Φυσικά! Πείτε μου περισσότερες λεπτομέρειες.', 'Εξαιρετική ερώτηση!', 'Καταλαβαίνω την κατάστασή σας.', 'Αυτό είναι ένα σημαντικό θέμα.'],
    hu: ['Köszönöm a kérdését!', 'Természetesen! Mondjon több részletet.', 'Nagyszerű kérdés!', 'Megértem a helyzetét.', 'Ez egy fontos téma.'],
    no: ['Takk for spørsmålet deres!', 'Selvfølgelig! Fortell meg flere detaljer.', 'Flott spørsmål!', 'Jeg forstår situasjonen deres.', 'Dette er et viktig tema.'],
    ro: ['Mulțumesc pentru întrebarea voastră!', 'Desigur! Spuneți-mi mai multe detalii.', 'Întrebare excelentă!', 'Înțeleg situația voastră.', 'Aceasta este o temă importantă.'],
    sv: ['Tack för er fråga!', 'Självklart! Berätta mer detaljer för mig.', 'Fantastisk fråga!', 'Jag förstår er situation.', 'Detta är ett viktigt ämne.'],
    th: ['ขอบคุณสำหรับคำถามของคุณ!', 'แน่นอน! บอกรายละเอียดเพิ่มเติมกับฉัน', 'คำถามที่ยอดเยี่ยม!', 'ฉันเข้าใจสถานการณ์ของคุณ', 'นี่เป็นหัวข้อที่สำคัญ'],
    vi: ['Cảm ơn câu hỏi của bạn!', 'Tất nhiên! Hãy kể cho tôi thêm chi tiết.', 'Câu hỏi tuyệt vời!', 'Tôi hiểu tình huống của bạn.', 'Đây là một chủ đề quan trọng.'],
    bg: ['Благодаря за вашия въпрос!', 'Разбира се! Разкажете ми повече подробности.', 'Отличен въпрос!', 'Разбирам вашата ситуация.', 'Това е важна тема.'],
    sr: ['Хвала на вашем питању!', 'Наравно! Реците ми више детаља.', 'Одлично питање!', 'Разумем вашу ситуацију.', 'Ово је важна тема.'],
    sk: ['Ďakujem za vašu otázku!', 'Samozrejme! Povedzte mi viac podrobností.', 'Skvelá otázka!', 'Rozumiem vašej situácii.', 'To je dôležitá téma.'],
    sl: ['Hvala za vaše vprašanje!', 'Seveda! Povejte mi več podrobnosti.', 'Odlično vprašanje!', 'Razumem vašo situacijo.', 'To je pomembna tema.']
  };
  
  if (liveChatData.selectedResponses && liveChatData.selectedResponses.trim()) {
    // Используем точные ответы из LiveChatEditor
    responses = liveChatData.selectedResponses.split('\n').filter(line => line.trim());
    console.log('✅ Using EXACT responses from LiveChatEditor:', responses);
  } else {
    // Используем fallback ответы для указанного языка
    responses = fallbackResponses[languageCode] || fallbackResponses['en'];
    console.log('⚠️ Using fallback responses for language:', languageCode);
  }
  
  console.log('📤 Final responses for export:', responses);
  
  // Создаем сообщение только для выбранного языка
  const busySpecialistsMessages = {
    ru: 'К сожалению, наши специалисты заняты из-за большой загрузки. Пожалуйста, заполните контактную форму в конце сайта для персональной консультации. 📋',
    en: 'Unfortunately, our specialists are busy due to high workload. Please fill out the contact form at the end of the site for personalized consultation. 📋',
    es: 'Lamentablemente, nuestros especialistas están ocupados debido a la alta carga de trabajo. Por favor, completen el formulario de contacto al final del sitio para una consulta personalizada. 📋',
    tr: 'Maalesef, uzmanlarımız yoğun iş yükü nedeniyle meşguller. Kişiselleştirilmiş danışmanlık için lütfen sitenin sonundaki iletişim formunu doldurun. 📋',
    de: 'Leider sind unsere Spezialisten aufgrund hoher Arbeitsbelastung beschäftigt. Bitte füllen Sie das Kontaktformular am Ende der Website für eine persönliche Beratung aus. 📋',
    it: 'Purtroppo, i nostri specialisti sono occupati a causa dell\'alto carico di lavoro. Per favore, compilate il modulo di contatto alla fine del sito per una consulenza personalizzata. 📋',
    pt: 'Infelizmente, nossos especialistas estão ocupados devido à alta carga de trabalho. Por favor, preencham o formulário de contato no final do site para consulta personalizada. 📋',
    nl: 'Helaas zijn onze specialisten bezig vanwege de hoge werkdruk. Vul het contactformulier aan het einde van de site in voor persoonlijk advies. 📋',
    ja: '申し訳ございませんが、専門スタッフは業務量が多いため対応中です。個別相談については、サイト末尾のお問い合わせフォームにご記入ください。📋',
    ko: '죄송하지만 업무량이 많아 전문가들이 바쁩니다. 개인 상담을 위해 사이트 끝에 있는 문의 양식을 작성해 주세요. 📋',
    he: 'למרבה הצער, המומחים שלנו עסוקים בגלל עומס עבודה גבוה. אנא מלאו את טופס הפנייה בסוף האתר לקבלת ייעוץ אישי. 📋',
    hi: 'खुशी की बात है कि हमारे विशेषज्ञ अधिक कार्यभार के कारण व्यस्त हैं। व्यक्तिगत परामर्श के लिए कृपया साइट के अंत में संपर्क फॉर्म भरें। 📋',
    uk: 'На жаль, наші спеціалісти зайняті через велике навантаження. Будь ласка, заповніть форму звернення в кінці сайту для отримання персональної консультації. 📋',
    zh: '很抱歉，我们的专家由于工作量大而忙碌。请填写网站末尾的联系表格以获得个性化咨询。📋',
    ar: 'للأسف، خبراؤنا مشغولون بسبب ضغط العمل الكبير. يرجى ملء نموذج الاتصال في نهاية الموقع للحصول على استشارة شخصية. 📋',
    fr: 'Malheureusement, nos spécialistes sont occupés en raison d\'une forte charge de travail. Veuillez remplir le formulaire de contact à la fin du site pour une consultation personnalisée. 📋',
    pl: 'Niestety, nasi specjaliści są zajęci z powodu dużego obciążenia pracą. Proszę wypełnić formularz kontaktowy na końcu strony, aby uzyskać spersonalizowaną konsultację. 📋',
    cs: 'Bohužel jsou naši specialisté zaneprázdněni kvůli vysoké pracovní zátěži. Prosím vyplňte kontaktní formulář na konci stránky pro personalizovanou konzultaci. 📋',
    da: 'Desværre er vores specialister optaget på grund af høj arbejdsbyrde. Udfyld venligst kontaktformularen i slutningen af siden for personlig rådgivning. 📋',
    fi: 'Valitettavasti asiantuntijamme ovat kiireisiä suuren työmäärän vuoksi. Täyttäkää yhteystietolomake sivun lopussa henkilökohtaista neuvontaa varten. 📋',
    el: 'Δυστυχώς, οι ειδικοί μας είναι απασχολημένοι λόγω μεγάλου φόρτου εργασίας. Παρακαλώ συμπληρώστε τη φόρμα επικοινωνίας στο τέλος του ιστότοπου για εξατομικευμένη συμβουλευτική. 📋',
    hu: 'Sajnos szakértőink elfoglaltak a nagy munkaterhelés miatt. Kérjük, töltse ki a kapcsolatfelvételi űrlapot az oldal végén személyre szabott tanácsadásért. 📋',
    no: 'Dessverre er våre spesialister opptatt på grunn av høy arbeidsmengde. Vennligst fyll ut kontaktskjemaet på slutten av siden for personlig rådgivning. 📋',
    ro: 'Din păcate, specialiștii noștri sunt ocupați din cauza volumului mare de muncă. Vă rugăm să completați formularul de contact de la sfârșitul site-ului pentru consultanță personalizată. 📋',
    sv: 'Tyvärr är våra specialister upptagna på grund av hög arbetsbelastning. Vänligen fyll i kontaktformuläret i slutet av sidan för personlig rådgivning. 📋',
    th: 'ขออภัย ผู้เชี่ยวชาญของเรายุ่งเนื่องจากภาระงานที่มาก กรุณากรอกแบบฟอร์มติดต่อที่ท้ายเว็บไซต์เพื่อรับคำปรึกษาเฉพาะบุคคล 📋',
    vi: 'Rất tiếc, các chuyên gia của chúng tôi đang bận rộn do khối lượng công việc lớn. Vui lòng điền vào biểu mẫu liên hệ ở cuối trang web để được tư vấn cá nhân. 📋',
    bg: 'За съжаление, нашите специалисти са заети поради голямото натоварване. Моля, попълнете формуляра за контакт в края на сайта за персонализирана консултация. 📋',
    sr: 'Нажалост, наши стручњаци су заузети због великог оптерећења. Молимо попуните контакт форму на крају сајта за персонализовано саветовање. 📋',
    sk: 'Bohužiaľ, naši špecialisti sú zaneprázdnení kvôli vysokému pracovnému zaťaženiu. Prosím vyplňte kontaktný formulár na konci stránky pre personalizované poradenstvo. 📋',
    sl: 'Žal so naši strokovnjaki zasedeni zaradi velike obremenitve z delom. Prosimo, izpolnite kontaktni obrazec na koncu strani za osebno svetovanje. 📋'
  };
  
  const selectedBusyMessage = busySpecialistsMessages[languageCode] || busySpecialistsMessages['en'];
  const escapedBusyMessage = selectedBusyMessage.replace(/'/g, "\\'");
  
  return `(function(){
    console.log('🚀 Live Chat JS loaded - Direct Mode');
    const SITE_NAME='${siteName}';
    const LANGUAGE='${languageCode}';
    const PRESET_RESPONSES = ${JSON.stringify(responses)};
    const MESSAGE_LIMIT = 5;
    
    let messageCounter=1;
    let isLoading=false;
    let userMessageCount = 0;
    let usedResponses = [];
    
    const chatToggle=document.getElementById('chatToggle');
    const chatWindow=document.getElementById('chatWindow');
    const chatClose=document.getElementById('chatClose');
    const messagesContainer=document.getElementById('messagesContainer');
    const messageInput=document.getElementById('messageInput');
    const sendButton=document.getElementById('sendButton');
    const loadingIndicator=document.getElementById('loadingIndicator');
    const chatStatus=document.getElementById('chatStatus');
    const liveChatWidget=document.getElementById('liveChatWidget');
    

    const BUSY_SPECIALISTS_MESSAGE = '${escapedBusyMessage}';
    
    

    const playClickSound = () => {
      try {
        const audio = new Audio('assets/chat-open.ogg');
        audio.volume = 0.3;
        audio.play().then(() => {
          console.log('🔊 Chat open sound played');
        }).catch(err => {
          console.log('🔇 Could not play chat sound:', err.message);
        });
      } catch (error) {
        console.log('🔇 Audio not available:', error.message);
      }
    };
    
    function getRandomResponse() {

      if (userMessageCount > MESSAGE_LIMIT) {
        if (chatStatus) {
          chatStatus.classList.remove('hidden');
        }
        return null;
      }

      
      if (userMessageCount === MESSAGE_LIMIT) {
        return BUSY_SPECIALISTS_MESSAGE;
      }

      const availableResponses = PRESET_RESPONSES.filter((_, index) => !usedResponses.includes(index));
      
      if (availableResponses.length === 0) {
        usedResponses = [];
        return PRESET_RESPONSES[Math.floor(Math.random() * PRESET_RESPONSES.length)];
      }

      const randomIndex = Math.floor(Math.random() * availableResponses.length);
      const selectedResponse = availableResponses[randomIndex];
      const originalIndex = PRESET_RESPONSES.indexOf(selectedResponse);
      usedResponses.push(originalIndex);
      
      return selectedResponse;
    }
    
    function initChat(){
      console.log('🚀 Initializing direct chat...');
      if(!chatToggle || !chatWindow || !messageInput || !sendButton) {
        console.error('❌ Chat elements not found');
        return;
      }
      
      const headerTitle = document.querySelector('[data-header-title]');
      if(headerTitle) {
        headerTitle.textContent = SITE_NAME;
      }
      
      chatToggle.addEventListener('click',toggleChat);
      chatClose.addEventListener('click',closeChat);
      sendButton.addEventListener('click',sendMessage);
      messageInput.addEventListener('keydown',handleKeyPress);
      messageInput.addEventListener('input',handleInputChange);
      messageInput.addEventListener('input',autoResizeTextarea);
      

      liveChatWidget.classList.add('ready');

      chatToggle.classList.add('has-new-message');
      

      const chatWasClosed = sessionStorage.getItem('chat-manually-closed') === 'true';
      if (!chatWasClosed) {
        setTimeout(() => {

          if (chatWindow.classList.contains('hidden') && !sessionStorage.getItem('chat-manually-closed')) {
            console.log('🎯 Auto-opening chat after 5 seconds');
            openChat();

            chatToggle.classList.add('has-new-message');
          }
        }, 5000);
      } else {
        console.log('💭 Chat auto-open skipped - user previously closed manually in this session');
      }
      
      console.log('✅ Direct chat initialized successfully');
    }
    
    function toggleChat(){
      const isOpen=!chatWindow.classList.contains('hidden');
      if(isOpen){
        closeChat();
      }else{
        openChat();
      }
    }
    
    function openChat(){
      chatWindow.classList.remove('hidden');
      chatToggle.querySelector('.chat-icon').classList.add('hidden');
      chatToggle.querySelector('.close-icon').classList.remove('hidden');
      messageInput.focus();
      
      
      playClickSound();
      

      chatToggle.classList.remove('has-new-message');
    }
    
    function closeChat(){
      chatWindow.classList.add('hidden');
      chatToggle.querySelector('.chat-icon').classList.remove('hidden');
      chatToggle.querySelector('.close-icon').classList.add('hidden');
      
      
      sessionStorage.setItem('chat-manually-closed', 'true');
      console.log('💾 Chat manually closed - auto-open disabled for this session');
      
      
      chatToggle.classList.remove('has-new-message');
    }
    
    function handleKeyPress(e){
      if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        sendMessage();
      }
    }
    
    function handleInputChange(){
      const hasText=messageInput.value.trim().length>0;
      sendButton.disabled=!hasText;
    }
    
    function autoResizeTextarea(){
      messageInput.style.height='auto';
        messageInput.style.height=Math.min(messageInput.scrollHeight,140)+'px';
    }
    
    function scrollToBottom(){
      setTimeout(()=>{
        messagesContainer.scrollTop=messagesContainer.scrollHeight;
      },100);
    }
    
    function addMessage(text,isUser=false){
      const messageDiv=document.createElement('div');
      messageDiv.className='message '+(isUser?'user-message':'bot-message');
      
      const avatar=document.createElement('div');
      avatar.className='message-avatar'+(isUser?'':' operator');
      
      const bubble=document.createElement('div');
      bubble.className='message-bubble';
      
      const messageText=document.createElement('div');
      messageText.className='message-text';
      messageText.textContent=text;
      
      const messageTime=document.createElement('div');
      messageTime.className='message-time';
      messageTime.textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
      
      bubble.appendChild(messageText);
      bubble.appendChild(messageTime);
      messageDiv.appendChild(avatar);
      messageDiv.appendChild(bubble);
      
      messagesContainer.insertBefore(messageDiv,loadingIndicator);
      scrollToBottom();
    }
    
    function showTypingIndicator() {
      loadingIndicator.classList.remove('hidden');
      scrollToBottom();
    }
    
    function hideTypingIndicator() {
      loadingIndicator.classList.add('hidden');
    }
    
        async function sendMessage(){
      const message=messageInput.value.trim();
      if(!message||isLoading) {
        console.log('❌ Cannot send message');
        return;
      }
      
      console.log('🚀 Sending message:', message);
      
      addMessage(message,true);
      messageInput.value='';
      handleInputChange();
      autoResizeTextarea();
      userMessageCount++;
      
      showTypingIndicator();
      isLoading = true;
      
      setTimeout(() => {
        hideTypingIndicator();
        isLoading = false;
        
        const response = getRandomResponse();
        if (response) {
          addMessage(response, false);
        }
        
        console.log('✅ Message sent. Messages count:', userMessageCount);
      }, 1000 + Math.random() * 2000);
    }
    
    if(document.readyState==='loading'){
      document.addEventListener('DOMContentLoaded',initChat);
    }else{
      initChat();
    }
    
    console.log('💬 Direct chat system ready for language: ${languageCode}');
  })();`;
};
