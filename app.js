// ResolveAI - Lógica do Aplicativo com Suporte a Múltiplas APIs

document.addEventListener('DOMContentLoaded', () => {
    // Configurações dos Provedores de API
    const PROVIDERS = {
        groq: {
            name: 'Groq Cloud',
            icon: '⚡',
            keyLabel: 'Chave de API do Groq',
            keyLink: 'https://console.groq.com/keys',
            storageKey: 'resolveai_key_groq',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            placeholder: 'gsk_...',
            textModels: [
                { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Recomendado)' },
                { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Mais rápido)' },
                { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
                { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B' }
            ],
            visionModels: [
                { id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B' }
            ]
        },
        openai: {
            name: 'ChatGPT (OpenAI)',
            icon: '🟢',
            keyLabel: 'Chave de API da OpenAI',
            keyLink: 'https://platform.openai.com/api-keys',
            storageKey: 'resolveai_key_openai',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            placeholder: 'sk-proj-...',
            textModels: [
                { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Rápido e Eficiente)' },
                { id: 'gpt-4o', name: 'GPT-4o (Mais Inteligente)' },
                { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
                { id: 'o3-mini', name: 'o3-mini (Raciocínio Rápido)' }
            ],
            visionModels: [
                { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Visão Multimodal)' },
                { id: 'gpt-4o', name: 'GPT-4o (Visão Avançada)' }
            ]
        },
        gemini: {
            name: 'Google Gemini',
            icon: '💎',
            keyLabel: 'Chave de API do Google AI',
            keyLink: 'https://aistudio.google.com/app/apikey',
            storageKey: 'resolveai_key_gemini',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            placeholder: 'AIzaSy...',
            textModels: [
                { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recomendado)' },
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
                { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash Lite' },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
            ],
            visionModels: [
                { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Visão Multimodal)' },
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Visão)' }
            ]
        },
        nvidia: {
            name: 'NVIDIA NIM',
            icon: '💚',
            keyLabel: 'Chave de API da NVIDIA NIM',
            keyLink: 'https://build.nvidia.com',
            storageKey: 'resolveai_key_nvidia',
            endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
            placeholder: 'nvapi-...',
            textModels: [
                { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct' },
                { id: 'deepseek-ai/deepseek-r1', name: 'DeepSeek R1 (NVIDIA)' },
                { id: 'mistralai/mistral-large-2-instruct', name: 'Mistral Large 2' }
            ],
            visionModels: [
                { id: 'meta/llama-3.2-11b-vision-instruct', name: 'Llama 3.2 11B Vision Instruct' }
            ]
        },
        deepseek: {
            name: 'DeepSeek API',
            icon: '🚀',
            keyLabel: 'Chave de API do DeepSeek',
            keyLink: 'https://platform.deepseek.com/api_keys',
            storageKey: 'resolveai_key_deepseek',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            placeholder: 'sk-...',
            textModels: [
                { id: 'deepseek-chat', name: 'DeepSeek V3 (Chat)' },
                { id: 'deepseek-reasoner', name: 'DeepSeek R1 (Raciocínio)' }
            ],
            visionModels: [
                { id: 'deepseek-chat', name: 'DeepSeek V3 (Apenas Texto)' }
            ]
        },
        openrouter: {
            name: 'OpenRouter',
            icon: '🌐',
            keyLabel: 'Chave de API do OpenRouter',
            keyLink: 'https://openrouter.ai/keys',
            storageKey: 'resolveai_key_openrouter',
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            placeholder: 'sk-or-v1-...',
            textModels: [
                { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (OpenRouter)' },
                { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct' },
                { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1' },
                { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' }
            ],
            visionModels: [
                { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Visão)' },
                { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Visão)' }
            ]
        }
    };

    // Estado Geral
    let selectedImages = [];
    let currentProvider = 'groq';
    let currentRenderedData = null;
    let historyList = [];
    let activeAudioUtterance = null;
    let activeAudioButton = null;
    let calcExpression = '';
    
    // Elementos DOM Principais
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const historyBtn = document.getElementById('history-btn');
    const historyCountBadge = document.getElementById('history-count-badge');
    const configDrawer = document.getElementById('config-drawer');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const providerCards = document.querySelectorAll('.provider-card');
    const apiKeyLabel = document.getElementById('api-key-label');
    const getKeyLink = document.getElementById('get-key-link');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelSelect = document.getElementById('model-select');
    const visionModelSelect = document.getElementById('vision-model-select');
    
    // Elementos do Painel de Resultados & Exportação
    const exportBtnGroup = document.getElementById('export-btn-group');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportTxtBtn = document.getElementById('export-txt-btn');
    const summaryBtn = document.getElementById('summary-btn');

    // Elementos do Modal de Resumo
    const summaryModal = document.getElementById('summary-modal');
    const closeSummaryBtn = document.getElementById('close-summary-btn');
    const summaryContent = document.getElementById('summary-content');
    const copySummaryBtn = document.getElementById('copy-summary-btn');

    // Elementos da Calculadora
    const calcToggleBtn = document.getElementById('calc-toggle-btn');
    const calcModal = document.getElementById('calculator-modal');
    const calcCloseBtn = document.getElementById('calc-close-btn');
    const calcDisplay = document.getElementById('calc-display');
    const calcEqualsBtn = document.getElementById('calc-equals');
    const calcClearBtn = document.getElementById('calc-clear');
    const calcDelBtn = document.getElementById('calc-del');
    const calcBtns = document.querySelectorAll('.calc-btn[data-val]');

    // Elementos de Importação de Arquivo
    const fileDropZone = document.getElementById('file-drop-zone');
    const fileDocInput = document.getElementById('file-doc-input');

    // Container de Confetti
    const confettiContainer = document.getElementById('confetti-container');

    // Elementos do Modal de Histórico
    const historyModal = document.getElementById('history-modal');
    const closeHistoryBtn = document.getElementById('close-history-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const historySearchInput = document.getElementById('history-search-input');
    const historyListContainer = document.getElementById('history-list');
    
    // Elementos de Personalização
    const themeSwatches = document.querySelectorAll('.theme-swatch');
    const customInstructionsInput = document.getElementById('custom-instructions');
    const answerLinesInput = document.getElementById('answer-lines');
    const answerLinesValue = document.getElementById('answer-lines-value');
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const questionText = document.getElementById('question-text');
    
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewGrid = document.getElementById('preview-grid');
    const galleryCounter = document.getElementById('gallery-counter');
    const clearAllBtn = document.getElementById('clear-all-btn');
    
    const resolveBtn = document.getElementById('resolve-btn');
    const demoBtn = document.getElementById('demo-btn');
    const emptyDemoBtn = document.getElementById('empty-demo-btn');
    
    const emptyState = document.getElementById('empty-state');
    const loadingState = document.getElementById('loading-state');
    const loadingText = document.getElementById('loading-text');
    const questionsList = document.getElementById('questions-list');
    const resultsCountBadge = document.getElementById('results-count-badge');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // ----------------------------------------------------
    // GERENCIAMENTO DE HISTÓRICO LOCAL
    // ----------------------------------------------------
    const loadHistory = () => {
        try {
            const stored = localStorage.getItem('resolveai_history');
            historyList = stored ? JSON.parse(stored) : [];
        } catch (e) {
            historyList = [];
        }
        updateHistoryBadge();
    };

    const updateHistoryBadge = () => {
        if (historyCountBadge) {
            historyCountBadge.textContent = historyList.length;
        }
    };

    const saveToHistory = (data) => {
        if (!data || !data.questions || data.questions.length === 0) return;

        const dateObj = new Date();
        const entry = {
            id: Date.now().toString(),
            timestamp: dateObj.toISOString(),
            dateStr: dateObj.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
            providerName: PROVIDERS[currentProvider]?.name || 'IA',
            questionsCount: data.questions.length,
            previewText: data.questions[0]?.question || 'Resolução de questões',
            data: data
        };

        if (historyList.length > 0 && JSON.stringify(historyList[0].data) === JSON.stringify(data)) {
            return;
        }

        historyList.unshift(entry);
        if (historyList.length > 40) historyList.pop();

        localStorage.setItem('resolveai_history', JSON.stringify(historyList));
        updateHistoryBadge();
    };

    const renderHistoryList = (filterText = '') => {
        historyListContainer.innerHTML = '';

        const filtered = historyList.filter(item => {
            if (!filterText) return true;
            const text = (item.previewText + ' ' + item.providerName).toLowerCase();
            return text.includes(filterText.toLowerCase());
        });

        if (filtered.length === 0) {
            historyListContainer.innerHTML = `
                <div class="empty-history-text">
                    <p>${filterText ? 'Nenhuma resolução encontrada para a pesquisa.' : 'Seu histórico está vazio no momento. Resolva questões para salvá-las aqui!'}</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-item';

            card.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-title">${item.questionsCount} Questão(ões) • ${item.providerName}</span>
                    <span class="history-item-date">${item.dateStr}</span>
                </div>
                <p class="history-item-preview">${item.previewText}</p>
                <div class="history-item-actions">
                    <button class="btn btn-primary btn-sm load-hist-btn" data-id="${item.id}">Visualizar Resolução</button>
                    <button class="btn btn-secondary btn-sm delete-hist-btn" data-id="${item.id}">Excluir</button>
                </div>
            `;

            card.querySelector('.load-hist-btn').addEventListener('click', () => {
                renderQuestions(item.data, false);
                closeHistoryModal();
                showToast('Resolução do histórico carregada com sucesso!', 'success');
            });

            card.querySelector('.delete-hist-btn').addEventListener('click', () => {
                historyList = historyList.filter(h => h.id !== item.id);
                localStorage.setItem('resolveai_history', JSON.stringify(historyList));
                updateHistoryBadge();
                renderHistoryList(historySearchInput.value.trim());
                showToast('Item removido do histórico.', 'success');
            });

            historyListContainer.appendChild(card);
        });
    };

    const openHistoryModal = () => {
        renderHistoryList();
        historyModal.classList.remove('hidden');
    };

    const closeHistoryModal = () => {
        historyModal.classList.add('hidden');
    };

    historyBtn.addEventListener('click', openHistoryModal);
    closeHistoryBtn.addEventListener('click', closeHistoryModal);
    
    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) closeHistoryModal();
    });

    clearHistoryBtn.addEventListener('click', () => {
        if (historyList.length === 0) return;
        if (confirm('Tem certeza que deseja apagar todo o seu histórico de resoluções?')) {
            historyList = [];
            localStorage.removeItem('resolveai_history');
            updateHistoryBadge();
            renderHistoryList();
            showToast('Histórico limpo com sucesso.', 'success');
        }
    });

    historySearchInput.addEventListener('input', (e) => {
        renderHistoryList(e.target.value.trim());
    });

    // ----------------------------------------------------
    // RECURSO DE LEITURA POR VOZ (TEXT-TO-SPEECH)
    // ----------------------------------------------------
    const stopAudioPlayback = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (activeAudioButton) {
            activeAudioButton.classList.remove('active-audio');
            activeAudioButton.querySelector('span').textContent = 'Ouvir Resolução';
            activeAudioButton = null;
        }
        activeAudioUtterance = null;
    };

    const toggleSpeakQuestion = (q, buttonEl) => {
        if (!('speechSynthesis' in window)) {
            showToast('Seu navegador não suporta leitura por áudio.');
            return;
        }

        if (activeAudioButton === buttonEl && window.speechSynthesis.speaking) {
            stopAudioPlayback();
            showToast('Áudio interrompido.');
            return;
        }

        stopAudioPlayback();

        let narrative = `Questão: ${q.question}. `;

        if (q.type === 'multiple_choice') {
            const correctOpt = q.options.find(o => o.label.toUpperCase() === q.correct_option.toUpperCase());
            if (correctOpt) {
                narrative += `Resposta correta: Opção ${correctOpt.label}. ${correctOpt.text}. `;
            }
        } else if (q.suggested_answer) {
            narrative += `Resposta sugerida: ${q.suggested_answer}. `;
        }

        if (q.explanation) {
            narrative += `Explicação: ${q.explanation}`;
        }

        const utterance = new SpeechSynthesisUtterance(narrative);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;

        utterance.onstart = () => {
            activeAudioButton = buttonEl;
            activeAudioUtterance = utterance;
            buttonEl.classList.add('active-audio');
            buttonEl.querySelector('span').textContent = 'Parar Áudio';
        };

        utterance.onend = () => stopAudioPlayback();
        utterance.onerror = () => stopAudioPlayback();

        window.speechSynthesis.speak(utterance);
    };

    // ----------------------------------------------------
    // RECURSO DE COPIAR RESPOSTA (1 CLIQUE)
    // ----------------------------------------------------
    const copyQuestionToClipboard = async (q, buttonEl) => {
        let textToCopy = `QUESTÃO:\n${q.question}\n\n`;

        if (q.type === 'multiple_choice') {
            textToCopy += `ALTERNATIVAS:\n`;
            q.options.forEach(opt => {
                const isCorrect = opt.label.toUpperCase() === q.correct_option.toUpperCase();
                textToCopy += `${opt.label}) ${opt.text}${isCorrect ? ' [CORRETA]' : ''}\n`;
            });
            textToCopy += `\nRESPOSTA RECOMENDADA: Opção ${q.correct_option}\n`;
        } else {
            textToCopy += `RESPOSTA RECOMENDADA:\n${q.suggested_answer}\n`;
        }

        if (q.explanation) {
            textToCopy += `\nEXPLICAÇÃO:\n${q.explanation}\n`;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            const btnSpan = buttonEl.querySelector('span');
            const originalText = btnSpan.textContent;

            btnSpan.textContent = 'Copiado!';
            buttonEl.style.borderColor = 'var(--success)';
            buttonEl.style.color = 'var(--success)';

            showToast('Questão copiada para a área de transferência!', 'success');

            setTimeout(() => {
                btnSpan.textContent = originalText;
                buttonEl.style.borderColor = '';
                buttonEl.style.color = '';
            }, 2500);

        } catch (err) {
            showToast('Não foi possível copiar automaticamente.');
        }
    };

    // ----------------------------------------------------
    // EXPORTAÇÃO EM TXT E PDF
    // ----------------------------------------------------
    const exportAsTXT = () => {
        if (!currentRenderedData || !currentRenderedData.questions || currentRenderedData.questions.length === 0) {
            showToast('Nenhuma resolução disponível para exportar.');
            return;
        }

        const providerName = PROVIDERS[currentProvider]?.name || 'IA';
        let txtContent = `==================================================\n`;
        txtContent += `RESOLVEAI - RELATÓRIO DE QUESTÕES RESOLVIDAS\n`;
        txtContent += `Data de Geramento: ${new Date().toLocaleString('pt-BR')}\n`;
        txtContent += `Provedor de IA: ${providerName}\n`;
        txtContent += `==================================================\n\n`;

        currentRenderedData.questions.forEach((q, idx) => {
            txtContent += `--------------------------------------------------\n`;
            txtContent += `QUESTÃO ${idx + 1} [${q.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Resposta Escrita'}]\n`;
            txtContent += `--------------------------------------------------\n`;
            txtContent += `Enunciado: ${q.question}\n\n`;

            if (q.type === 'multiple_choice') {
                txtContent += `Opções:\n`;
                q.options.forEach(opt => {
                    const isCorrect = opt.label.toUpperCase() === q.correct_option.toUpperCase();
                    txtContent += `  ${opt.label}) ${opt.text}${isCorrect ? ' (Correta)' : ''}\n`;
                });
                txtContent += `\nResposta Correta: ${q.correct_option}\n`;
            } else {
                txtContent += `Resposta Recomendada:\n${q.suggested_answer}\n`;
            }

            if (q.explanation) {
                txtContent += `\nExplicação Detalhada:\n${q.explanation}\n`;
            }
            txtContent += `\n\n`;
        });

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ResolveAI_Questoes_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Relatório em formato TXT baixado com sucesso!', 'success');
    };

    const exportAsPDF = () => {
        if (!currentRenderedData || !currentRenderedData.questions || currentRenderedData.questions.length === 0) {
            showToast('Nenhuma resolução disponível para exportar.');
            return;
        }
        window.print();
    };

    exportTxtBtn.addEventListener('click', exportAsTXT);
    exportPdfBtn.addEventListener('click', exportAsPDF);

    // ----------------------------------------------------
    // CONFETTI ANIMATION
    // ----------------------------------------------------
    const CONFETTI_COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f97316', '#ec4899', '#facc15', '#06b6d4', '#f43f5e'];

    const launchConfetti = () => {
        confettiContainer.innerHTML = '';
        const count = 70;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            const left = Math.random() * 100;
            const size = Math.random() * 8 + 5;
            const duration = Math.random() * 2 + 1.5;
            const delay = Math.random() * 0.6;
            const shapes = ['50%', '2px', '0'];
            const borderRadius = shapes[Math.floor(Math.random() * shapes.length)];

            particle.style.cssText = `
                left: ${left}%;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${borderRadius};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
            `;
            confettiContainer.appendChild(particle);
        }
        setTimeout(() => { confettiContainer.innerHTML = ''; }, 4000);
    };

    // ----------------------------------------------------
    // CALCULADORA CIENTÍFICA
    // ----------------------------------------------------
    calcToggleBtn.addEventListener('click', () => {
        calcModal.classList.toggle('hidden');
    });

    calcCloseBtn.addEventListener('click', () => {
        calcModal.classList.add('hidden');
    });

    calcBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.val;
            calcExpression += val;
            calcDisplay.value = calcExpression;
        });
    });

    calcClearBtn.addEventListener('click', () => {
        calcExpression = '';
        calcDisplay.value = '';
    });

    calcDelBtn.addEventListener('click', () => {
        calcExpression = calcExpression.slice(0, -1);
        calcDisplay.value = calcExpression;
    });

    calcEqualsBtn.addEventListener('click', () => {
        try {
            // Replace sin/cos/tan with Math. versions for eval
            let expr = calcExpression
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(');
            // Safety check: only allow math characters
            if (/^[\d+\-*/().\s,Math.sqrtsincoantPIpowe**]+$/.test(expr)) {
                const result = Function('"use strict"; return (' + expr + ')')();
                calcDisplay.value = Number.isFinite(result) ? parseFloat(result.toFixed(10)) : 'Erro';
                calcExpression = calcDisplay.value === 'Erro' ? '' : calcDisplay.value.toString();
            } else {
                calcDisplay.value = 'Expressão inválida';
                calcExpression = '';
            }
        } catch (e) {
            calcDisplay.value = 'Erro';
            calcExpression = '';
        }
    });

    // ----------------------------------------------------
    // IMPORTAÇÃO DE ARQUIVO (.txt / .docx)
    // ----------------------------------------------------
    fileDropZone.addEventListener('click', (e) => {
        if (e.target.closest('.file-hidden')) return;
        fileDocInput.click();
    });

    fileDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropZone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(ev => {
        fileDropZone.addEventListener(ev, () => {
            fileDropZone.classList.remove('dragover');
        });
    });

    fileDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleFileImport(e.dataTransfer.files[0]);
        }
    });

    fileDocInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileImport(e.target.files[0]);
            fileDocInput.value = '';
        }
    });

    const handleFileImport = async (file) => {
        const name = file.name.toLowerCase();

        if (name.endsWith('.txt')) {
            const text = await file.text();
            if (text.trim()) {
                questionText.value = text;
                // Switch to text tab
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="text-tab"]').classList.add('active');
                document.getElementById('text-tab').classList.add('active');
                showToast(`Arquivo "${file.name}" importado com sucesso!`, 'success');
            } else {
                showToast('O arquivo está vazio.');
            }
        } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
            if (typeof mammoth === 'undefined') {
                showToast('Biblioteca mammoth.js ainda não carregou. Tente novamente em alguns segundos.');
                return;
            }
            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                if (result.value.trim()) {
                    questionText.value = result.value;
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabPanes.forEach(p => p.classList.remove('active'));
                    document.querySelector('.tab-btn[data-tab="text-tab"]').classList.add('active');
                    document.getElementById('text-tab').classList.add('active');
                    showToast(`Arquivo Word "${file.name}" importado com sucesso!`, 'success');
                } else {
                    showToast('Não foi possível extrair texto deste arquivo Word.');
                }
            } catch (err) {
                showToast('Erro ao ler o arquivo Word: ' + err.message);
            }
        } else {
            showToast('Formato não suportado. Use arquivos .txt ou .docx');
        }
    };

    // ----------------------------------------------------
    // RESUMO AUTOMÁTICO DA MATÉRIA (via IA)
    // ----------------------------------------------------
    summaryBtn.addEventListener('click', () => generateSummary());
    closeSummaryBtn.addEventListener('click', () => summaryModal.classList.add('hidden'));
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) summaryModal.classList.add('hidden');
    });

    copySummaryBtn.addEventListener('click', async () => {
        const text = summaryContent.textContent;
        if (!text || text.includes('Clique em')) return;
        try {
            await navigator.clipboard.writeText(text);
            showToast('Resumo copiado para a área de transferência!', 'success');
        } catch (err) {
            showToast('Não foi possível copiar.');
        }
    });

    const generateSummary = async () => {
        if (!currentRenderedData || !currentRenderedData.questions || currentRenderedData.questions.length === 0) {
            showToast('Resolva questões primeiro para gerar um resumo.');
            return;
        }

        const providerConfig = PROVIDERS[currentProvider];
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showToast(`Insira sua API Key do ${providerConfig.name} nas Configurações.`);
            return;
        }

        summaryModal.classList.remove('hidden');
        summaryContent.innerHTML = '<div class="summary-loading"><div class="radar-pulse"></div><p>Gerando resumo teórico com IA...</p></div>';

        try {
            const questionsText = currentRenderedData.questions.map((q, i) => {
                let txt = `Questão ${i + 1}: ${q.question}`;
                if (q.explanation) txt += ` | Explicação: ${q.explanation}`;
                return txt;
            }).join('\n');

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            if (currentProvider === 'openrouter') {
                headers['HTTP-Referer'] = window.location.href;
                headers['X-Title'] = 'ResolveAI';
            }

            const body = {
                model: modelSelect.value,
                messages: [
                    { role: 'system', content: 'Você é um professor que cria resumos teóricos claros e didáticos em português brasileiro. Gere um resumo conciso dos tópicos abordados nas questões fornecidas, organizado por matéria/assunto. Use tópicos e parágrafos curtos. Não inclua as questões em si, apenas o conteúdo teórico.' },
                    { role: 'user', content: `Gere um resumo teórico dos tópicos abordados nestas questões:\n\n${questionsText}` }
                ],
                temperature: 0.4
            };

            const response = await fetch(providerConfig.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Erro ${response.status}`);
            }

            const data = await response.json();
            let rawText = data.choices[0].message.content || '';
            // Clean thinking tags
            rawText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
            summaryContent.textContent = rawText;
            showToast('Resumo gerado com sucesso!', 'success');
        } catch (err) {
            summaryContent.innerHTML = `<p style="color: var(--error);">Erro ao gerar resumo: ${err.message}</p>`;
            showToast('Erro ao gerar resumo: ' + err.message);
        }
    };

    // ----------------------------------------------------
    // DICA ANTES DA RESPOSTA (via IA)
    // ----------------------------------------------------
    const getHintForQuestion = async (q, hintContainer, hintBtn) => {
        const providerConfig = PROVIDERS[currentProvider];
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showToast(`Insira sua API Key do ${providerConfig.name} nas Configurações.`);
            return;
        }

        // Check if hint already exists
        if (hintContainer.querySelector('.hint-bubble:not(.hint-loading)')) {
            hintContainer.innerHTML = '';
            hintBtn.querySelector('span').textContent = 'Dica';
            return;
        }

        hintContainer.innerHTML = '<div class="hint-bubble hint-loading"><span class="hint-label">💡 Dica</span>Gerando dica com IA...</div>';
        hintBtn.querySelector('span').textContent = 'Carregando...';

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };
            if (currentProvider === 'openrouter') {
                headers['HTTP-Referer'] = window.location.href;
                headers['X-Title'] = 'ResolveAI';
            }

            let questionContext = `Questão: ${q.question}`;
            if (q.options) {
                questionContext += '\nOpções: ' + q.options.map(o => `${o.label}) ${o.text}`).join(', ');
            }

            const body = {
                model: modelSelect.value,
                messages: [
                    { role: 'system', content: 'Você é um tutor gentil. Dê APENAS UMA dica sutil e curta (1-2 frases) para ajudar o aluno a pensar na direção certa, sem revelar a resposta. Seja encorajador. Responda em português.' },
                    { role: 'user', content: `Me dê uma dica para esta questão sem revelar a resposta:\n\n${questionContext}` }
                ],
                temperature: 0.7
            };

            const response = await fetch(providerConfig.endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Erro na API');

            const data = await response.json();
            let hintText = data.choices[0].message.content || 'Sem dica disponível.';
            hintText = hintText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

            hintContainer.innerHTML = `<div class="hint-bubble"><span class="hint-label">💡 Dica</span>${hintText}</div>`;
            hintBtn.querySelector('span').textContent = 'Ocultar Dica';
        } catch (err) {
            hintContainer.innerHTML = `<div class="hint-bubble" style="border-color: var(--error);"><span class="hint-label" style="color:var(--error);">⚠️ Erro</span>Não foi possível gerar a dica.</div>`;
            hintBtn.querySelector('span').textContent = 'Dica';
        }
    };

    // Popula as listas de modelo de texto e visão conforme o provedor ativo
    const populateModelSelects = (providerId) => {
        const provider = PROVIDERS[providerId];
        if (!provider) return;

        // Modelos de Texto
        modelSelect.innerHTML = '';
        provider.textModels.forEach((m, idx) => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name;
            if (idx === 0) opt.selected = true;
            modelSelect.appendChild(opt);
        });

        const savedModel = localStorage.getItem(`resolveai_model_${providerId}`);
        if (savedModel && Array.from(modelSelect.options).some(o => o.value === savedModel)) {
            modelSelect.value = savedModel;
        }

        // Modelos de Visão
        visionModelSelect.innerHTML = '';
        provider.visionModels.forEach((m, idx) => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.name;
            if (idx === 0) opt.selected = true;
            visionModelSelect.appendChild(opt);
        });

        const savedVisionModel = localStorage.getItem(`resolveai_vision_model_${providerId}`);
        if (savedVisionModel && Array.from(visionModelSelect.options).some(o => o.value === savedVisionModel)) {
            visionModelSelect.value = savedVisionModel;
        }
    };

    // Alternar Provedor de API
    const switchProvider = (providerId) => {
        if (!PROVIDERS[providerId]) return;
        
        // Salvar chave do provedor anterior se houver
        if (apiKeyInput && currentProvider) {
            const val = apiKeyInput.value.trim();
            localStorage.setItem(PROVIDERS[currentProvider].storageKey, val);
        }

        currentProvider = providerId;
        const providerConfig = PROVIDERS[providerId];

        // Atualizar destaque visual nas cards de provedores
        providerCards.forEach(card => {
            if (card.dataset.provider === providerId) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Atualizar Rótulos, Link e Input de Chave
        apiKeyLabel.textContent = providerConfig.keyLabel;
        getKeyLink.href = providerConfig.keyLink;
        apiKeyInput.placeholder = providerConfig.placeholder;
        
        // Carregar chave salva para o novo provedor
        const savedKey = localStorage.getItem(providerConfig.storageKey) || '';
        apiKeyInput.value = savedKey;

        // Atualizar Dropdowns de Modelos
        populateModelSelects(providerId);

        // Salvar o provedor ativo no localStorage
        localStorage.setItem('resolveai_active_provider', providerId);
    };

    // Configurar Ouvintes de Clique nas Cards de Provedor
    providerCards.forEach(card => {
        card.addEventListener('click', () => {
            const providerId = card.dataset.provider;
            switchProvider(providerId);
            showToast(`Provedor alterado para ${PROVIDERS[providerId].name}`, 'success');
        });
    });

    // Salvar Chave em Tempo Real quando o Usuário Digita
    apiKeyInput.addEventListener('input', (e) => {
        if (currentProvider && PROVIDERS[currentProvider]) {
            localStorage.setItem(PROVIDERS[currentProvider].storageKey, e.target.value.trim());
        }
    });

    // Carregar todas as Configurações Salvas
    const loadConfig = () => {
        const savedProvider = localStorage.getItem('resolveai_active_provider') || 'groq';
        const savedTheme = localStorage.getItem('resolveai_theme') || 'cyberpunk';
        const savedInstructions = localStorage.getItem('resolveai_custom_instructions') || '';
        const savedLines = localStorage.getItem('resolveai_answer_lines') || '3';
        
        // Ativar Provedor
        switchProvider(savedProvider);
        
        // Carregar Tema Visual
        applyTheme(savedTheme);
        
        // Carregar Histórico
        loadHistory();
        
        // Carregar Instruções Personalizadas e Slider de Linhas
        customInstructionsInput.value = savedInstructions;
        answerLinesInput.value = savedLines;
        answerLinesValue.textContent = `${savedLines} Linhas`;
    };

    // Aplicar Tema Visual
    const applyTheme = (themeName) => {
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
        
        themeSwatches.forEach(swatch => {
            if (swatch.dataset.theme === themeName) {
                swatch.classList.add('active');
            } else {
                swatch.classList.remove('active');
            }
        });
        
        localStorage.setItem('resolveai_theme', themeName);
    };

    // Cliques nos Swatches de Tema
    themeSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            applyTheme(swatch.dataset.theme);
            showToast(`Tema alterado para ${swatch.title}!`, 'success');
        });
    });

    // Atualização em Tempo Real do Slider de Linhas
    answerLinesInput.addEventListener('input', (e) => {
        answerLinesValue.textContent = `${e.target.value} Linhas`;
    });

    // Toggle da Gaveta de Configurações
    toggleConfigBtn.addEventListener('click', () => {
        configDrawer.classList.toggle('collapsed');
    });

    // Botão de Salvar Configurações
    saveConfigBtn.addEventListener('click', () => {
        if (currentProvider && PROVIDERS[currentProvider]) {
            localStorage.setItem(PROVIDERS[currentProvider].storageKey, apiKeyInput.value.trim());
            localStorage.setItem(`resolveai_model_${currentProvider}`, modelSelect.value);
            localStorage.setItem(`resolveai_vision_model_${currentProvider}`, visionModelSelect.value);
        }
        localStorage.setItem('resolveai_custom_instructions', customInstructionsInput.value.trim());
        localStorage.setItem('resolveai_answer_lines', answerLinesInput.value);
        
        showToast('Configurações e preferências salvas com sucesso!', 'success');
        configDrawer.classList.add('collapsed');
    });

    // Gerenciador de Abas (Texto vs Imagem)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(btn.dataset.tab);
            targetPane.classList.add('active');
        });
    });

    // Upload de Imagem - Drag & Drop e Clique (Múltiplas Imagens)
    dropZone.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-control') || e.target.closest('.preview-item') || e.target.closest('.add-image-card')) return;
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFiles(files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFiles(e.target.files);
        }
    });

    const handleImageFiles = async (files) => {
        const remainingSlots = 10 - selectedImages.length;
        if (remainingSlots <= 0) {
            showToast('Você já atingiu o limite de 10 imagens.');
            return;
        }

        const filesToProcess = Array.from(files).slice(0, remainingSlots);
        if (files.length > remainingSlots) {
            showToast(`Apenas as primeiras ${remainingSlots} imagens foram adicionadas (máximo de 10).`);
        }

        for (const file of filesToProcess) {
            if (!file.type.startsWith('image/')) {
                showToast(`O arquivo "${file.name}" não é uma imagem válida.`);
                continue;
            }

            try {
                const base64Data = await readFileAsBase64(file);
                selectedImages.push({
                    id: Date.now().toString() + Math.random().toString().slice(2, 6),
                    name: file.name,
                    mimeType: file.type,
                    base64: base64Data
                });
            } catch (err) {
                showToast(`Erro ao ler o arquivo: ${file.name}`);
            }
        }
        
        fileInput.value = '';
        updateGalleryPreview();
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const updateGalleryPreview = () => {
        const count = selectedImages.length;
        galleryCounter.textContent = `${count} / 10 Imagens`;

        if (count === 0) {
            previewContainer.classList.add('hidden');
            dropZone.querySelector('.upload-prompt').classList.remove('hidden');
            return;
        }

        previewContainer.classList.remove('hidden');
        dropZone.querySelector('.upload-prompt').classList.add('hidden');
        previewGrid.innerHTML = '';

        selectedImages.forEach(img => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            
            const image = document.createElement('img');
            image.src = `data:${img.mimeType};base64,${img.base64}`;
            image.alt = img.name;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-single-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.title = 'Remover Imagem';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedImages = selectedImages.filter(i => i.id !== img.id);
                updateGalleryPreview();
            });

            item.appendChild(image);
            item.appendChild(removeBtn);
            previewGrid.appendChild(item);
        });

        if (count < 10) {
            const addCard = document.createElement('div');
            addCard.className = 'add-image-card';
            addCard.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Adicionar</span>
            `;
            addCard.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput.click();
            });
            previewGrid.appendChild(addCard);
        }
    };

    clearAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedImages = [];
        fileInput.value = '';
        updateGalleryPreview();
        showToast('Todas as imagens foram removidas.', 'success');
    });

    // Toast de Notificação
    const showToast = (message, type = 'error') => {
        toastMessage.textContent = message;
        if (type === 'success') {
            toast.querySelector('.toast-content').style.borderColor = 'var(--success)';
            toast.querySelector('.toast-icon').style.color = 'var(--success)';
            toast.querySelector('.toast-icon').innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
        } else {
            toast.querySelector('.toast-content').style.borderColor = 'var(--error)';
            toast.querySelector('.toast-icon').style.color = 'var(--error)';
            toast.querySelector('.toast-icon').innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
        }
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    };

    // Obter Dados Mockados para Demonstração
    const getMockData = (lines) => {
        let answerText = "";
        if (lines == 2) {
            answerText = "Gentrificação é o processo de revitalização e encarecimento de bairros históricos ou periféricos. Seu principal impacto é a expulsão forçada de famílias de baixa renda devido à alta de aluguéis.";
        } else if (lines == 4) {
            answerText = "Gentrificação é a reestruturação urbana de bairros de baixa renda por meio de investimentos privados e comerciais. Isso gera uma valorização imobiliária agressiva que atrai moradores de classe média-alta. Como consequência direta, a comunidade tradicional é deslocada por não conseguir arcar com o custo de vida inflacionado, promovendo a segregação social.";
        } else if (lines >= 5) {
            answerText = "Gentrificação é o processo de elitização e remodelação de bairros historicamente operários ou periféricos. Esse fenômeno é alimentado pela especulação imobiliária e intervenções governamentais de revitalização. Como resultado, ocorre a mercantilização cultural do território e a atração de comércios luxuosos. O impacto socioeconômico mais severo é o despejo indireto dos antigos moradores vulneráveis, cujas redes de solidariedade local são desmanteladas pelo encarecimento generalizado do bairro.";
        } else {
            answerText = "Gentrificação é o processo de valorização e transformação urbana de um bairro periférico ou histórico, que atrai moradores de maior renda. Seu principal impacto é a expulsão de moradores tradicionais de baixa renda devido ao aumento no custo de vida e aluguel.";
        }

        return {
            "provider_info": `${PROVIDERS[currentProvider]?.name || 'Groq'} (${modelSelect.value || 'Llama 3.3'})`,
            "questions": [
                {
                    "id": 1,
                    "type": "multiple_choice",
                    "question": "Qual das seguintes estruturas celulares é a responsável direta pela respiração celular e produção de ATP nas células eucarióticas?",
                    "options": [
                        {"label": "A", "text": "Complexo de Golgi"},
                        {"label": "B", "text": "Ribossomos livres"},
                        {"label": "C", "text": "Mitocôndria"},
                        {"label": "D", "text": "Lisossomos"}
                    ],
                    "correct_option": "C",
                    "explanation": "A mitocôndria é a organela responsável pela respiração celular aeróbica, ciclo de Krebs e fosforilação oxidativa, culminando na produção primária de ATP (energia)."
                },
                {
                    "id": 2,
                    "type": "written",
                    "question": "Explique resumidamente o conceito de 'Gentrificação' e cite um dos seus principais impactos socioeconômicos nas cidades modernas.",
                    "suggested_answer": answerText,
                    "explanation": "Esse fenômeno altera o perfil social e comercial das regiões. Enquanto traz melhorias na infraestrutura e segurança local, acentua a segregação socioespacial das populações mais vulneráveis."
                },
                {
                    "id": 3,
                    "type": "multiple_choice",
                    "question": "Um bloco de metal de 2 kg é puxado por uma força constante horizontal de 10 N ao longo de uma superfície plana sem atrito. Partindo do repouso, qual é a distância percorrida por este bloco após 4 segundos?",
                    "options": [
                        {"label": "A", "text": "20 metros"},
                        {"label": "B", "text": "40 metros"},
                        {"label": "C", "text": "80 metros"},
                        {"label": "D", "text": "160 metros"}
                    ],
                    "correct_option": "B",
                    "explanation": "Pela Segunda Lei de Newton, a aceleração é a = F / m = 10 N / 2 kg = 5 m/s². Usando a função horária da posição para o MUV partir do repouso: d = (a * t²) / 2 = (5 * 4²) / 2 = (5 * 16) / 2 = 80 / 2 = 40 metros."
                }
            ]
        };
    };

    // Renderizador Dinâmico de Questões (com Ações de Áudio, Cópia e Histórico)
    const renderQuestions = (data, shouldSaveToHistory = true) => {
        stopAudioPlayback();
        currentRenderedData = data;

        questionsList.innerHTML = '';
        if (!data || !data.questions || data.questions.length === 0) {
            emptyState.classList.remove('hidden');
            questionsList.classList.add('hidden');
            resultsCountBadge.style.display = 'none';
            exportBtnGroup.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        questionsList.classList.remove('hidden');
        resultsCountBadge.style.display = 'block';
        exportBtnGroup.classList.remove('hidden');
        
        const providerName = PROVIDERS[currentProvider]?.name || 'IA';
        resultsCountBadge.textContent = `${data.questions.length} Questões • ${providerName}`;

        data.questions.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.style.animationDelay = `${idx * 0.15}s`;

            const badgeRow = document.createElement('div');
            badgeRow.className = 'q-badge-row';
            
            const qNum = document.createElement('span');
            qNum.className = 'q-number';
            qNum.textContent = `Questão ${idx + 1}`;
            
            const qType = document.createElement('span');
            qType.className = 'q-type';
            qType.textContent = q.type === 'multiple_choice' ? 'Múltipla Escolha' : 'Resposta Escrita';

            badgeRow.appendChild(qNum);
            badgeRow.appendChild(qType);
            card.appendChild(badgeRow);

            const qText = document.createElement('p');
            qText.className = 'q-text';
            qText.textContent = q.question;
            card.appendChild(qText);

            if (q.type === 'multiple_choice') {
                const optionsGrid = document.createElement('div');
                optionsGrid.className = 'options-grid';

                q.options.forEach(opt => {
                    const optBtn = document.createElement('button');
                    optBtn.className = 'option-item';
                    if (opt.label.toUpperCase() === q.correct_option.toUpperCase()) {
                        optBtn.classList.add('correct');
                    }

                    const optLet = document.createElement('span');
                    optLet.className = 'option-letter';
                    optLet.textContent = opt.label;

                    const optTxt = document.createElement('span');
                    optTxt.className = 'option-text';
                    optTxt.textContent = opt.text;

                    optBtn.appendChild(optLet);
                    optBtn.appendChild(optTxt);
                    
                    optBtn.addEventListener('click', () => {
                        const siblings = optionsGrid.querySelectorAll('.option-item');
                        siblings.forEach(s => s.classList.remove('user-wrong'));
                        
                        if (opt.label.toUpperCase() !== q.correct_option.toUpperCase()) {
                            optBtn.classList.add('user-wrong');
                            showToast('Resposta incorreta! A opção destacada em verde é a solução recomendada.');
                        } else {
                            launchConfetti();
                            showToast('Parabéns! Você escolheu a opção correta recomendada pela IA.', 'success');
                        }
                    });

                    optionsGrid.appendChild(optBtn);
                });
                card.appendChild(optionsGrid);
            } else {
                const writtenBox = document.createElement('div');
                writtenBox.className = 'written-answer-box';

                const label = document.createElement('span');
                label.className = 'answer-label';
                label.textContent = `Resolução Recomendada (Tamanho ideal: ${answerLinesInput.value} linhas)`;

                const content = document.createElement('p');
                content.className = 'answer-content';
                content.textContent = q.suggested_answer;

                writtenBox.appendChild(label);
                writtenBox.appendChild(content);
                card.appendChild(writtenBox);
            }

            if (q.explanation) {
                const expSection = document.createElement('div');
                expSection.className = 'explanation-section';

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'exp-toggle-btn';
                toggleBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    <span>Exibir Explicação Detalhada</span>
                `;

                const expContent = document.createElement('div');
                expContent.className = 'exp-content';
                
                const expText = document.createElement('p');
                expText.textContent = q.explanation;
                expContent.appendChild(expText);

                toggleBtn.addEventListener('click', () => {
                    const isVisible = expContent.classList.toggle('show');
                    toggleBtn.classList.toggle('active');
                    toggleBtn.querySelector('span').textContent = isVisible ? 'Ocultar Explicação' : 'Exibir Explicação Detalhada';
                });

                expSection.appendChild(toggleBtn);
                expSection.appendChild(expContent);
                card.appendChild(expSection);
            }

            // Barra de Ações Rápidas da Questão (Copiar & Áudio)
            const actionsBar = document.createElement('div');
            actionsBar.className = 'q-card-actions';

            // Botão Áudio (Text-to-Speech)
            const audioBtn = document.createElement('button');
            audioBtn.className = 'q-action-btn';
            audioBtn.type = 'button';
            audioBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                <span>Ouvir Resolução</span>
            `;
            audioBtn.addEventListener('click', () => toggleSpeakQuestion(q, audioBtn));

            // Botão Copiar Texto
            const copyBtn = document.createElement('button');
            copyBtn.className = 'q-action-btn';
            copyBtn.type = 'button';
            copyBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                <span>Copiar Texto</span>
            `;
            copyBtn.addEventListener('click', () => copyQuestionToClipboard(q, copyBtn));

            // Botão Dica (IA)
            const hintBtn = document.createElement('button');
            hintBtn.className = 'q-action-btn';
            hintBtn.type = 'button';
            hintBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span>Dica</span>
            `;

            const hintContainer = document.createElement('div');
            hintContainer.className = 'hint-container';

            hintBtn.addEventListener('click', () => getHintForQuestion(q, hintContainer, hintBtn));

            actionsBar.appendChild(audioBtn);
            actionsBar.appendChild(copyBtn);
            actionsBar.appendChild(hintBtn);
            card.appendChild(actionsBar);
            card.appendChild(hintContainer);

            questionsList.appendChild(card);
        });

        // Salvar no Histórico se for uma nova resolução
        if (shouldSaveToHistory) {
            saveToHistory(data);
        }
    };

    // Ativar Modo Demo
    const runDemo = () => {
        emptyState.classList.add('hidden');
        loadingState.classList.remove('hidden');
        loadingText.textContent = 'Carregando demonstração interativa...';
        questionsList.classList.add('hidden');

        setTimeout(() => {
            loadingState.classList.add('hidden');
            const data = getMockData(answerLinesInput.value);
            renderQuestions(data, true);
        }, 1000);
    };

    demoBtn.addEventListener('click', runDemo);
    emptyDemoBtn.addEventListener('click', runDemo);

    // Extração Inteligente de JSON da resposta da IA (trata blocos ```json e marcas <think>)
    const extractJsonFromResponse = (rawText) => {
        let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        cleaned = cleaned.replace(/```json\s*([\s\S]*?)\s*```/gi, '$1');
        cleaned = cleaned.replace(/```\s*([\s\S]*?)\s*```/gi, '$1').trim();
        
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        return JSON.parse(cleaned);
    };

    // Executar Chamada da API para o Provedor Selecionado
    const resolveQuestionsWithAI = async () => {
        const providerConfig = PROVIDERS[currentProvider];
        if (!providerConfig) return;

        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showToast(`Insira sua API Key do ${providerConfig.name} nas Configurações.`);
            configDrawer.classList.remove('collapsed');
            apiKeyInput.focus();
            return;
        }

        const isImageTab = document.querySelector('.tab-btn[data-tab="image-tab"]').classList.contains('active');
        let promptText = '';
        
        if (isImageTab) {
            if (selectedImages.length === 0) {
                showToast('Por favor, envie ao menos uma foto da prova/questões.');
                return;
            }
        } else {
            promptText = questionText.value.trim();
            if (!promptText) {
                showToast('Por favor, digite o texto da questão primeiro.');
                return;
            }
        }

        // Configurar Estado de Carregamento Visual
        emptyState.classList.add('hidden');
        questionsList.classList.add('hidden');
        loadingState.classList.remove('hidden');
        resolveBtn.disabled = true;
        resolveBtn.querySelector('.loader-spinner').classList.remove('hidden');
        resolveBtn.querySelector('.btn-text').textContent = 'Processando...';

        try {
            const extraInstructions = customInstructionsInput.value.trim();
            const targetLines = answerLinesInput.value;

            let systemPrompt = `Você é um professor assistente especialista em resolver provas e responder questões escolares/acadêmicas. Você analisa o texto ou imagem fornecido, extrai todas as questões presentes de forma literal e as resolve.
Para cada questão extraída, classifique-a em 'multiple_choice' (se houver opções de assinalar) ou 'written' (se for discursiva/de escrever).
Se for múltipla escolha, identifique a opção correta.
Se for escrita, formule uma resposta muito objetiva contendo EXATAMENTE ${targetLines} linhas de texto corrido.
Forneça também uma explicação curta e didática do raciocínio/cálculo.
Você DEVE responder estritamente em formato JSON estruturado com a seguinte estrutura de exemplo:
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "Texto da questão de marcar...",
      "options": [
        {"label": "A", "text": "Texto da opção A"},
        {"label": "B", "text": "Texto da opção B"},
        {"label": "C", "text": "Texto da opção C"}
      ],
      "correct_option": "B",
      "explanation": "Explicação concisa do porquê B é a certa."
    },
    {
      "id": 2,
      "type": "written",
      "question": "Texto da questão escrita...",
      "suggested_answer": "Escreva a resposta contendo exatamente ${targetLines} linhas.",
      "explanation": "Explicação resumida do cálculo ou teoria."
    }
  ]
}
Sua resposta deve conter apenas o JSON, sem texto explicativo fora da estrutura JSON.`;

            if (extraInstructions) {
                systemPrompt += `\n\nATENÇÃO - INSTRUÇÃO ADICIONAL DE CUSTOMIZAÇÃO: ${extraInstructions}`;
            }

            let messages = [];
            let model = '';

            if (isImageTab) {
                loadingText.textContent = `Enviando ${selectedImages.length} imagem(ns) via ${providerConfig.name}...`;
                model = visionModelSelect.value;
                
                const userContent = [
                    { type: 'text', text: 'Resolva todas as questões contidas nestas imagens da prova/livro. Extraia todas as questões e responda estritamente no JSON especificado.' }
                ];

                selectedImages.forEach(img => {
                    userContent.push({
                        type: 'image_url',
                        image_url: {
                            url: `data:${img.mimeType};base64,${img.base64}`
                        }
                    });
                });

                messages = [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ];
            } else {
                loadingText.textContent = `Processando texto das questões via ${providerConfig.name} (${modelSelect.value})...`;
                model = modelSelect.value;
                messages = [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Resolva as seguintes questões: \n\n${promptText}` }
                ];
            }

            // Headers da Requisição HTTP
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            };

            if (currentProvider === 'openrouter') {
                headers['HTTP-Referer'] = window.location.href;
                headers['X-Title'] = 'ResolveAI';
            }

            // Payload da Requisição
            const bodyPayload = {
                model: model,
                messages: messages,
                temperature: 0.2
            };

            // Adicionar response_format se suportado pelo provedor
            if (['groq', 'openai', 'gemini', 'nvidia', 'openrouter'].includes(currentProvider)) {
                bodyPayload.response_format = { type: "json_object" };
            }

            const response = await fetch(providerConfig.endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(bodyPayload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errMessage = errorData.error?.message || errorData.message || `Erro da API ${providerConfig.name} (Status: ${response.status})`;
                throw new Error(errMessage);
            }

            const data = await response.json();
            const rawContent = data.choices[0].message.content || '';
            const parsedData = extractJsonFromResponse(rawContent);

            renderQuestions(parsedData, true);
            showToast(`Questões resolvidas com sucesso usando ${providerConfig.name}!`, 'success');

        } catch (error) {
            console.error(error);
            showToast(`Erro na requisição: ${error.message}`);
            emptyState.classList.remove('hidden');
        } finally {
            loadingState.classList.add('hidden');
            resolveBtn.disabled = false;
            resolveBtn.querySelector('.loader-spinner').classList.add('hidden');
            resolveBtn.querySelector('.btn-text').textContent = 'Resolver Questões';
        }
    };

    resolveBtn.addEventListener('click', resolveQuestionsWithAI);
    
    // Iniciar o aplicativo carregando a configuração salva e histórico
    loadConfig();
});
