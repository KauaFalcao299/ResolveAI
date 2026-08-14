// ResolveAI - Lógica do Aplicativo com Customização

document.addEventListener('DOMContentLoaded', () => {
    // Configurações & Estado
    let selectedImageBase64 = null;
    let selectedImageMimeType = null;
    
    // Elementos DOM
    const toggleConfigBtn = document.getElementById('toggle-config-btn');
    const configDrawer = document.getElementById('config-drawer');
    const saveConfigBtn = document.getElementById('save-config-btn');
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
    const imagePreview = document.getElementById('image-preview');
    const removeImgBtn = document.getElementById('remove-img-btn');
    
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

    // Inicialização - Carregar Configurações do LocalStorage
    const loadConfig = () => {
        const savedKey = localStorage.getItem('resolveai_api_key');
        const savedModel = localStorage.getItem('resolveai_model');
        const savedVisionModel = localStorage.getItem('resolveai_vision_model');
        const savedTheme = localStorage.getItem('resolveai_theme') || 'cyberpunk';
        const savedInstructions = localStorage.getItem('resolveai_custom_instructions') || '';
        const savedLines = localStorage.getItem('resolveai_answer_lines') || '3';
        
        if (savedKey) apiKeyInput.value = savedKey;
        if (savedModel) modelSelect.value = savedModel;
        if (savedVisionModel) visionModelSelect.value = savedVisionModel;
        
        // Carregar Tema
        applyTheme(savedTheme);
        
        // Carregar Instruções Personalizadas
        customInstructionsInput.value = savedInstructions;
        
        // Carregar Slider de Linhas
        answerLinesInput.value = savedLines;
        answerLinesValue.textContent = `${savedLines} Linhas`;
    };

    // Aplicar Tema
    const applyTheme = (themeName) => {
        // Remover classes de tema antigas
        document.body.className = '';
        document.body.classList.add(`theme-${themeName}`);
        
        // Atualizar visual dos swatches
        themeSwatches.forEach(swatch => {
            if (swatch.dataset.theme === themeName) {
                swatch.classList.add('active');
            } else {
                swatch.classList.remove('active');
            }
        });
        
        localStorage.setItem('resolveai_theme', themeName);
    };

    // Configurar Cliques nos Swatches de Tema
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

    // Toggle Config Drawer
    toggleConfigBtn.addEventListener('click', () => {
        configDrawer.classList.toggle('collapsed');
    });

    // Salvar Configurações
    saveConfigBtn.addEventListener('click', () => {
        localStorage.setItem('resolveai_api_key', apiKeyInput.value.trim());
        localStorage.setItem('resolveai_model', modelSelect.value);
        localStorage.setItem('resolveai_vision_model', visionModelSelect.value);
        localStorage.setItem('resolveai_custom_instructions', customInstructionsInput.value.trim());
        localStorage.setItem('resolveai_answer_lines', answerLinesInput.value);
        
        showToast('Configurações e personalização salvas!', 'success');
        configDrawer.classList.add('collapsed');
    });

    // Gerenciador de Abas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(btn.dataset.tab);
            targetPane.classList.add('active');
        });
    });

    // Upload de Imagem - Drag & Drop e Clique
    dropZone.addEventListener('click', (e) => {
        if (e.target.closest('#remove-img-btn')) return;
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
            handleImageFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    const handleImageFile = (file) => {
        if (!file.type.startsWith('image/')) {
            showToast('Por favor, envie apenas arquivos de imagem.');
            return;
        }
        
        selectedImageMimeType = file.type;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            selectedImageBase64 = reader.result.split(',')[1];
            imagePreview.src = reader.result;
            previewContainer.classList.remove('hidden');
        };
        reader.onerror = () => {
            showToast('Erro ao processar imagem.');
        };
    };

    removeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        selectedImageBase64 = null;
        selectedImageMimeType = null;
        imagePreview.src = '';
        previewContainer.classList.add('hidden');
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
        // Gera resposta de escrita adaptada ao tamanho customizado
        let answerText = "";
        if (lines == 2) {
            answerText = "Gentrificação é o processo de revitalização e encarecimento de bairros históricos ou periféricos. Seu principal impacto é a expulsão forçada de famílias de baixa renda devido à alta de aluguéis.";
        } else if (lines == 4) {
            answerText = "Gentrificação é a reestruturação urbana de bairros de baixa renda por meio de investimentos privados e comerciais. Isso gera uma valorização imobiliária agressiva que atrai moradores de classe média-alta. Como consequência direta, a comunidade tradicional é deslocada por não conseguir arcar com o custo de vida inflacionado, promovendo a segregação social.";
        } else if (lines >= 5) {
            answerText = "Gentrificação é o processo de elitização e remodelação de bairros historicamente operários ou periféricos. Esse fenômeno é alimentado pela especulação imobiliária e intervenções governamentais de revitalização. Como resultado, ocorre a mercantilização cultural do território e a atração de comércios luxuosos. O impacto socioeconômico mais severo é o despejo indireto dos antigos moradores vulneráveis, cujas redes de solidariedade local são desmanteladas pelo encarecimento generalizado do bairro.";
        } else {
            // Default 3 lines
            answerText = "Gentrificação é o processo de valorização e transformação urbana de um bairro periférico ou histórico, que atrai moradores de maior renda. Seu principal impacto é a expulsão de moradores tradicionais de baixa renda devido ao aumento no custo de vida e aluguel.";
        }

        return {
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
        resultsCountBadge.textContent = `${data.questions.length} Questões`;

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

            // Render based on Type
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
                    
                    // Seletor de opções interativo se o usuário clicar
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

            // Explanation section (if available)
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
        }, 1200);
    };

    demoBtn.addEventListener('click', runDemo);
    emptyDemoBtn.addEventListener('click', runDemo);

    // Chamar API do Groq
    const resolveQuestionsWithGroq = async () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            showToast('API Key do Groq necessária! Insira nas Configurações.');
            configDrawer.classList.remove('collapsed');
            return;
        }

        const isImageTab = document.querySelector('.tab-btn[data-tab="image-tab"]').classList.contains('active');
        let promptText = '';
        
        if (isImageTab) {
            if (!selectedImageBase64) {
                showToast('Por favor, envie uma foto da prova/questões primeiro.');
                return;
            }
        } else {
            promptText = questionText.value.trim();
            if (!promptText) {
                showToast('Por favor, digite o texto da questão primeiro.');
                return;
            }
        }

        // Configurar Loading
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
Sua resposta deve conter apenas o JSON, sem markdown adicional ou explicações externas ao JSON.`;

            if (extraInstructions) {
                systemPrompt += `\n\nATENÇÃO - INSTRUÇÃO ADICIONAL DE CUSTOMIZAÇÃO (Siga estritamente esta instrução no conteúdo da resposta): ${extraInstructions}`;
            }

            let messages = [];
            let model = '';

            if (isImageTab) {
                loadingText.textContent = 'Enviando imagem para análise do Groq Vision...';
                model = visionModelSelect.value;
                messages = [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: 'Resolva todas as questões contidas nesta imagem. Classifique-as no JSON conforme especificado.' },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${selectedImageMimeType};base64,${selectedImageBase64}`
                                }
                            }
                        ]
                    }
                ];
            } else {
                loadingText.textContent = 'Analisando textos das questões com o Groq...';
                model = modelSelect.value;
                messages = [
                    { role: 'system', content: systemPrompt },
                    {
                        role: 'user',
                        content: `Resolva as seguintes questões: \n\n${promptText}`
                    }
                ];
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    temperature: 0.2,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Erro da API do Groq (Status: ${response.status})`);
            }

            const data = await response.json();
            const rawJsonText = data.choices[0].message.content.trim();
            const parsedData = JSON.parse(rawJsonText);

            renderQuestions(parsedData);
            showToast('Questões resolvidas com sucesso!', 'success');

        } catch (error) {
            console.error(error);
            showToast(`Ocorreu um erro: ${error.message}`);
            emptyState.classList.remove('hidden');
        } finally {
            loadingState.classList.add('hidden');
            resolveBtn.disabled = false;
            resolveBtn.querySelector('.loader-spinner').classList.add('hidden');
            resolveBtn.querySelector('.btn-text').textContent = 'Resolver Questões';
        }
    };

    resolveBtn.addEventListener('click', resolveQuestionsWithGroq);
    
    // Iniciar carregando a configuração salva
    loadConfig();
});
