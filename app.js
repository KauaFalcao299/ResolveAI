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
                { id: 'llama-3.2-11b-vision-preview', name: 'Llama 3.2 11B Vision' },
                { id: 'llama-3.2-90b-vision-preview', name: 'Llama 3.2 90B Vision' }
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
    let selectedImages = []; // Array de { id, base64, mimeType, name }
    let currentProvider = 'groq';
    
    // Elementos DOM
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const configDrawer = document.getElementById('config-drawer');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const providerCards = document.querySelectorAll('.provider-card');
    const apiKeyLabel = document.getElementById('api-key-label');
    const getKeyLink = document.getElementById('get-key-link');
    const apiKeyInput = document.getElementById('api-key-input');
    const modelSelect = document.getElementById('model-select');
    const visionModelSelect = document.getElementById('vision-model-select');
    
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

    // Renderizador Dinâmico de Questões
    const renderQuestions = (data) => {
        questionsList.innerHTML = '';
        if (!data || !data.questions || data.questions.length === 0) {
            emptyState.classList.remove('hidden');
            questionsList.classList.add('hidden');
            resultsCountBadge.style.display = 'none';
            return;
        }

        emptyState.classList.add('hidden');
        questionsList.classList.remove('hidden');
        resultsCountBadge.style.display = 'block';
        
        const providerName = PROVIDERS[currentProvider]?.name || 'IA';
        resultsCountBadge.textContent = `${data.questions.length} Questões • ${providerName}`;

        data.questions.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.style.animationDelay = `${idx * 0.15}s`;

            // Badge Row
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

            // Question Text
            const qText = document.createElement('p');
            qText.className = 'q-text';
            qText.textContent = q.question;
            card.appendChild(qText);

            // Render por Tipo
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
                            showToast('Parabéns! Você escolheu a opção correta recomendada pela IA.', 'success');
                        }
                    });

                    optionsGrid.appendChild(optBtn);
                });
                card.appendChild(optionsGrid);
            } else {
                // Written question
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

            // Explicação
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

            questionsList.appendChild(card);
        });
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
            renderQuestions(data);
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

            renderQuestions(parsedData);
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
    
    // Iniciar o aplicativo carregando a configuração salva
    loadConfig();
});

