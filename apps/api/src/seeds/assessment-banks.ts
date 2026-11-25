import { ASSESSMENT_QUESTIONS_COUNT } from '../domain/index.js';
import type { AssessmentQuestionDoc, AssessmentVariantDoc } from '../models/AssessmentBank.js';

type PoolQuestion = Omit<AssessmentQuestionDoc, 'id'>;

const QUESTION_POOLS_BY_SLUG: Record<string, PoolQuestion[]> = {
  'estrategia-discovery': [
    {
      conceptId: 'validacao-hipoteses',
      statement: 'Qual a melhor forma de estruturar uma hipótese antes de iniciar um experimento?',
      options: [
        { id: 'a', text: 'Definir público-alvo, comportamento esperado e critério objetivo de sucesso.' },
        { id: 'b', text: 'Listar todas as telas desejadas pelo time de engenharia.' },
        { id: 'c', text: 'Escolher a métrica mais favorável após ver os resultados.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Uma hipótese testável declara quem fará o quê e qual métrica mínima valida a suposição antes do teste.',
    },
    {
      conceptId: 'validacao-hipoteses',
      statement: 'Em entrevistas no estilo "The Mom Test", que pergunta gera evidência confiável?',
      options: [
        { id: 'a', text: 'Você pagaria R$ 50 por um app assim?' },
        { id: 'b', text: 'Qual foi a última vez que esse problema aconteceu e como você resolveu?' },
        { id: 'c', text: 'Você achou nossa ideia inovadora?' },
      ],
      correctOptionId: 'b',
      explanation:
        'Perguntar sobre comportamentos passados concretos evita elogios vazios e opiniões hipotéticas.',
    },
    {
      conceptId: 'validacao-hipoteses',
      statement: 'Para que serve a Matriz CSD no início de um projeto de startup?',
      options: [
        { id: 'a', text: 'Separar certezas, suposições e dúvidas para priorizar o que testar primeiro.' },
        { id: 'b', text: 'Substituir o contrato social entre os sócios.' },
        { id: 'c', text: 'Estimar o custo exato de infraestrutura em 5 anos.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A Matriz CSD expõe suposições arriscadas que precisam de validação antes de grandes investimentos.',
    },
    {
      conceptId: 'mvp',
      statement: 'Um MVP do tipo "Concierge" consiste em:',
      options: [
        { id: 'a', text: 'Entregar o valor manualmente ao cliente antes de automatizar com software.' },
        { id: 'b', text: 'Lançar um aplicativo completo com 100% das integrações.' },
        { id: 'c', text: 'Fazer apenas uma apresentação em slides sem contato com clientes.' },
      ],
      correctOptionId: 'a',
      explanation:
        'No MVP Concierge o serviço é operado manualmente para aprender sobre a dor real com custo mínimo.',
    },
    {
      conceptId: 'mvp',
      statement: 'Qual é o maior risco ao construir um MVP com excesso de funcionalidades?',
      options: [
        { id: 'a', text: 'Demorar para aprender e gastar recursos em algo que o cliente não valoriza.' },
        { id: 'b', text: 'Ter poucos usuários interessados em novidades.' },
        { id: 'c', text: 'Impedir o uso de testes automatizados no futuro.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O propósito do MVP é maximizar o aprendizado validado por unidade de esforço.',
    },
    {
      conceptId: 'mvp',
      statement: 'Quando um MVP "Mágico de Oz" é mais indicado?',
      options: [
        { id: 'a', text: 'Quando o cliente interage com uma interface simples, mas os bastidores são manuais.' },
        { id: 'b', text: 'Quando o produto já tem milhões de usuários ativos.' },
        { id: 'c', text: 'Quando não existe nenhuma hipótese para testar.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O Mágico de Oz simula automação na ponta enquanto humanos executam o processamento por trás.',
    },
    {
      conceptId: 'product-market-fit',
      statement: 'Segundo o teste de Sean Ellis, qual sinal indica proximidade de Product-Market Fit?',
      options: [
        { id: 'a', text: 'Pelo menos 40% dos usuários ficariam "muito desapontados" se o produto sumisse.' },
        { id: 'b', text: 'A empresa atingiu 10 mil seguidores em redes sociais.' },
        { id: 'c', text: 'O time de desenvolvimento zerou o backlog de bugs.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A pesquisa de Sean Ellis mede dependência real de valor percebido pelos usuários ativos.',
    },
    {
      conceptId: 'product-market-fit',
      statement: 'Qual comportamento na retenção por coorte costuma evidenciar Product-Market Fit?',
      options: [
        { id: 'a', text: 'A curva de retenção estabiliza em um patamar paralelo ao eixo X ao longo do tempo.' },
        { id: 'b', text: 'Todos os usuários cancelam após o primeiro dia de uso.' },
        { id: 'c', text: 'Apenas o tráfego pago cresce enquanto a retenção cai a zero.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Quando a curva achata acima de zero, um grupo consistente continua extraindo valor recorrente.',
    },
    {
      conceptId: 'product-market-fit',
      statement: 'Por que escalar marketing antes de atingir Product-Market Fit é perigoso?',
      options: [
        { id: 'a', text: 'Aumenta o gasto de aquisição para trazer clientes que logo abandonam o produto.' },
        { id: 'b', text: 'Reduz o valor das ações no primeiro dia.' },
        { id: 'c', text: 'Proíbe a equipe de fazer novas entrevistas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Escalar sem retenção é colocar água em um balde furado, queimando caixa rapidamente.',
    },
    {
      conceptId: 'okrs',
      statement: 'Qual característica diferencia um bom Key Result (KR) de uma simples tarefa?',
      options: [
        { id: 'a', text: 'Mede uma mudança de resultado/comportamento, não apenas a entrega de uma feature.' },
        { id: 'b', text: 'Descreve quantas horas o time trabalhou na semana.' },
        { id: 'c', text: 'Não possui número nem prazo definido.' },
      ],
      correctOptionId: 'a',
      explanation:
        'KRs focam em impacto mensurável (outcome), enquanto tarefas são meios (outputs) para atingi-lo.',
    },
    {
      conceptId: 'okrs',
      statement: 'Qual é o papel do "Objective" (Objetivo) dentro de um framework OKR?',
      options: [
        { id: 'a', text: 'Dar direção qualitativa, clara e inspiradora para o ciclo.' },
        { id: 'b', text: 'Substituir a folha de ponto da equipe.' },
        { id: 'c', text: 'Listar cada bug técnico do repositório.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O Objetivo responde "onde queremos chegar" de forma memorável e alinhada à estratégia.',
    },
    {
      conceptId: 'okrs',
      statement: 'Com que frequência uma startup deve fazer check-in dos seus OKRs?',
      options: [
        { id: 'a', text: 'Semanal ou quinzenalmente, para ajustar rotas antes do fim do ciclo.' },
        { id: 'b', text: 'Apenas no último dia do ano fiscal.' },
        { id: 'c', text: 'Somente quando um investidor pedir.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Check-ins curtos e frequentes mantêm o foco e permitem corrigir experimentos que não estão funcionando.',
    },
    {
      conceptId: 'validacao-hipoteses',
      statement: 'Se um experimento falha em atingir o critério de sucesso definido antes do teste, o time deve:',
      options: [
        { id: 'a', text: 'Registrar o aprendizado e decidir entre pivotar a abordagem ou ajustar a hipótese.' },
        { id: 'b', text: 'Mudar o critério de sucesso para parecer que o teste deu certo.' },
        { id: 'c', text: 'Ignorar os dados e seguir o plano original sem alterações.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Manter o critério pré-combinado garante honestidade intelectual e aprendizado real.',
    },
    {
      conceptId: 'mvp',
      statement: 'Qual exemplo representa melhor um MVP para validar demanda por um curso online?',
      options: [
        { id: 'a', text: 'Publicar uma landing page com proposta clara e botão de pré-matrícula.' },
        { id: 'b', text: 'Alugar um estúdio e gravar 40 aulas em 4K antes de falar com alunos.' },
        { id: 'c', text: 'Desenvolver uma rede social própria para os futuros alunos.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Uma landing page com intenção real de compra valida interesse antes do custo de produção.',
    },
  ],

  metodologias: [
    {
      conceptId: 'scrum',
      statement: 'No Scrum, quem é responsável por maximizar o valor do produto e ordenar o Product Backlog?',
      options: [
        { id: 'a', text: 'Product Owner (PO).' },
        { id: 'b', text: 'Scrum Master.' },
        { id: 'c', text: 'Stakeholder externo.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O Product Owner gerencia o Product Backlog garantindo que o time trabalhe no que gera mais valor.',
    },
    {
      conceptId: 'scrum',
      statement: 'Qual é o objetivo principal da Sprint Review no Scrum?',
      options: [
        { id: 'a', text: 'Inspecionar o incremento entregue com stakeholders e adaptar o backlog.' },
        { id: 'b', text: 'Avaliar individualmente o desempenho salarial dos desenvolvedores.' },
        { id: 'c', text: 'Planejar o orçamento anual da empresa.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A Sprint Review foca no produto funcionando e no feedback real para os próximos passos.',
    },
    {
      conceptId: 'scrum',
      statement: 'Qual o papel da Sprint Retrospective?',
      options: [
        { id: 'a', text: 'O time inspeciona como trabalhou junto e define melhorias de processo.' },
        { id: 'b', text: 'Apresentar slides comerciais para novos investidores.' },
        { id: 'c', text: 'Escrever especificações detalhadas de banco de dados.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A Retrospectiva promove melhoria contínua nas práticas, ferramentas e colaboração do time.',
    },
    {
      conceptId: 'kanban',
      statement: 'Por que o Kanban recomenda limitar o Trabalho em Progresso (WIP)?',
      options: [
        { id: 'a', text: 'Para reduzir troca de contexto, expor gargalos e acelerar a conclusão das tarefas.' },
        { id: 'b', text: 'Para impedir que novas ideias entrem no backlog.' },
        { id: 'c', text: 'Para eliminar a necessidade de comunicação entre membros.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Limitar o WIP faz o time terminar itens iniciados antes de puxar novos, reduzindo o lead time.',
    },
    {
      conceptId: 'kanban',
      statement: 'Em um quadro Kanban, o que significa "puxar trabalho"?',
      options: [
        { id: 'a', text: 'Um membro só inicia um novo item quando há capacidade disponível na coluna seguinte.' },
        { id: 'b', text: 'A liderança empurra todas as demandas urgentes simultaneamente.' },
        { id: 'c', text: 'Mover todos os cartões para "Concluído" na sexta-feira.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Sistemas puxados evitam sobrecarga e mantêm o fluxo contínuo e previsível.',
    },
    {
      conceptId: 'kanban',
      statement: 'Quando o Kanban costuma ser mais vantajoso que Sprints fixas de Scrum?',
      options: [
        { id: 'a', text: 'Em fluxos com demandas imprevisíveis e prioridade que muda continuamente, como suporte ou operação.' },
        { id: 'b', text: 'Quando a equipe nunca quer visualizar o status das tarefas.' },
        { id: 'c', text: 'Apenas quando o time tem mais de 500 pessoas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O fluxo contínuo do Kanban lida muito bem com entradas frequentes sem quebrar o planejamento de uma sprint.',
    },
    {
      conceptId: 'lean-startup',
      statement: 'Qual é a sequência correta do ciclo central da Startup Enxuta (Lean Startup)?',
      options: [
        { id: 'a', text: 'Construir → Medir → Aprender.' },
        { id: 'b', text: 'Vender → Contratar → Planejar.' },
        { id: 'c', text: 'Escalar → Documentar → Testar.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O ciclo Construir-Medir-Aprender busca minimizar o tempo total de iteração até validar valor.',
    },
    {
      conceptId: 'lean-startup',
      statement: 'No Lean Startup, o que caracteriza um "pivô"?',
      options: [
        { id: 'a', text: 'Uma mudança estruturada de estratégia mantendo o aprendizado conquistado, sem abandonar a visão.' },
        { id: 'b', text: 'Desistir da startup e fechar a empresa.' },
        { id: 'c', text: 'Trocar apenas a cor dos botões do site.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Pivotar é mudar uma hipótese fundamental (público, canal, modelo) com base em evidências.',
    },
    {
      conceptId: 'lean-startup',
      statement: 'Qual tipo de métrica o Lean Startup recomenda evitar por gerar falsa sensação de progresso?',
      options: [
        { id: 'a', text: 'Métricas de vaidade (ex.: total acumulado de cadastros sem medir uso ativo).' },
        { id: 'b', text: 'Métricas acionáveis de coorte e retenção.' },
        { id: 'c', text: 'Taxa de conversão por experimento.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Métricas de vaidade sempre sobem, mas não orientam decisões sobre valor entregue.',
    },
    {
      conceptId: 'shape-up',
      statement: 'No Shape Up, o que significa trabalhar com "Apetite" (Appetite) em vez de estimativa tradicional?',
      options: [
        { id: 'a', text: 'Definir quanto tempo o problema merece (ex.: 2 ou 6 semanas) e moldar a solução para caber nele.' },
        { id: 'b', text: 'Perguntar quantas horas uma lista fixa vai levar e aceitar qualquer atraso.' },
        { id: 'c', text: 'Cortar a qualidade dos testes para entregar mais rápido.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Tempo fixo e escopo variável protegem a equipe de projetos intermináveis.',
    },
    {
      conceptId: 'shape-up',
      statement: 'Para que serve o período de "Cooldown" entre ciclos no Shape Up?',
      options: [
        { id: 'a', text: 'Resolver pequenos bugs, explorar ideias e preparar apostas do próximo ciclo sem pressão de entrega.' },
        { id: 'b', text: 'Pausar completamente o produto fora do ar por duas semanas.' },
        { id: 'c', text: 'Realizar reuniões diárias de 3 horas com todos os setores.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O cooldown dá fôlego técnico e espaço para moldar (shaping) os próximos desafios.',
    },
    {
      conceptId: 'shape-up',
      statement: 'No Shape Up, o que acontece na "Betting Table" (Mesa de Apostas)?',
      options: [
        { id: 'a', text: 'Decide-se em quais pitches moldados o time vai apostar para o próximo ciclo.' },
        { id: 'b', text: 'Estima-se em minutos todas as subtarefas de programação.' },
        { id: 'c', text: 'Sorteia-se aleatoriamente o próximo projeto.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Em vez de manter um backlog infinito, os decisores avaliam pitches prontos e apostam nos mais estratégicos.',
    },
    {
      conceptId: 'scrum',
      statement: 'Qual a duração recomendada da Daily Scrum e qual seu foco?',
      options: [
        { id: 'a', text: 'Até 15 minutos, para o time sincronizar progresso rumo à meta da Sprint e expor impedimentos.' },
        { id: 'b', text: 'Uma hora de prestação de contas detalhada para a diretoria.' },
        { id: 'c', text: 'Duas horas para debater arquitetura de todo o semestre.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A Daily é um alinhamento rápido entre pares para adaptar o plano do dia.',
    },
    {
      conceptId: 'kanban',
      statement: 'O que representa o "Lead Time" em um fluxo Kanban?',
      options: [
        { id: 'a', text: 'O tempo total desde a solicitação do item até sua entrega ao cliente.' },
        { id: 'b', text: 'A quantidade de reuniões feitas no mês.' },
        { id: 'c', text: 'O número de pessoas no time de vendas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Lead Time mede a velocidade percebida pelo cliente do pedido até a entrega.',
    },
  ],

  'priorizacao-roadmap': [
    {
      conceptId: 'rice',
      statement: 'Na fórmula do RICE, quais quatro fatores compõem a pontuação de uma iniciativa?',
      options: [
        { id: 'a', text: 'Reach (Alcance), Impact (Impacto), Confidence (Confiança) e Effort (Esforço).' },
        { id: 'b', text: 'Risk (Risco), Income (Receita), Cost (Custo) e Energy (Energia).' },
        { id: 'c', text: 'Revenue, Ideas, Complexity e Execution.' },
      ],
      correctOptionId: 'a',
      explanation:
        'RICE calcula (Reach × Impact × Confidence) / Effort para comparar iniciativas objetivamente.',
    },
    {
      conceptId: 'rice',
      statement: 'Por que o fator "Confidence" (Confiança) é crucial no método RICE?',
      options: [
        { id: 'a', text: 'Reduz o peso de ideias baseadas apenas em achismo sem dados de suporte.' },
        { id: 'b', text: 'Garante que ideias da diretoria sempre fiquem em primeiro lugar.' },
        { id: 'c', text: 'Substitui a necessidade de estimar o esforço.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A confiança penaliza suposições sem evidências e valoriza decisões respaldadas por pesquisa ou métricas.',
    },
    {
      conceptId: 'rice',
      statement: 'Duas iniciativas têm o mesmo Alcance, Impacto e Confiança, mas A exige 1 pessoa-mês e B exige 4 pessoas-mês. Qual vence no RICE?',
      options: [
        { id: 'a', text: 'Iniciativa A, pois entrega o mesmo resultado com um quarto do esforço.' },
        { id: 'b', text: 'Iniciativa B, pois projetos maiores têm prioridade.' },
        { id: 'c', text: 'Ambas empatam porque o esforço não entra no cálculo.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Como o esforço fica no denominador da fórmula RICE, menor esforço eleva a pontuação.',
    },
    {
      conceptId: 'moscow',
      statement: 'O que significam as categorias do método MoSCoW?',
      options: [
        { id: 'a', text: 'Must have, Should have, Could have e Won’t have (this time).' },
        { id: 'b', text: 'Most, Some, Common e Weak.' },
        { id: 'c', text: 'Monthly, Sprint, Cycle e Weekly.' },
      ],
      correctOptionId: 'a',
      explanation:
        'MoSCoW cria acordos claros sobre o que é indispensável versus o que fica fora do ciclo atual.',
    },
    {
      conceptId: 'moscow',
      statement: 'Qual erro comum destrói a eficácia da priorização MoSCoW?',
      options: [
        { id: 'a', text: 'Classificar quase todos os itens como "Must have".' },
        { id: 'b', text: 'Deixar explícito o que ficou em "Won’t have" neste ciclo.' },
        { id: 'c', text: 'Revisar as prioridades com clientes e engenharia.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Se tudo é "Must have", não há negociação de escopo quando surgem imprevistos.',
    },
    {
      conceptId: 'moscow',
      statement: 'Por que explicitar o grupo "Won’t have" no MoSCoW ajuda o time?',
      options: [
        { id: 'a', text: 'Alinha expectativas dizendo claramente o que NÃO será feito agora.' },
        { id: 'b', text: 'Apaga definitivamente ideias boas para sempre.' },
        { id: 'c', text: 'Impede a criação de novos testes.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Dizer não com clareza protege o foco do ciclo vigente sem descartar ideias futuras.',
    },
    {
      conceptId: 'backlog',
      statement: 'O que significa dizer que um Product Backlog é um "artefato vivo"?',
      options: [
        { id: 'a', text: 'Ele evolui continuamente conforme novos aprendizados, feedbacks e mudanças de contexto.' },
        { id: 'b', text: 'Ele é congelado no dia 1 e nunca pode ser alterado.' },
        { id: 'c', text: 'Qualquer pessoa pode inserir tarefas direto na sprint em andamento sem critério.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Backlogs de startups se adaptam às evidências do mercado; itens velhos sem valor devem ser arquivados.',
    },
    {
      conceptId: 'backlog',
      statement: 'No critério DEEP para um bom backlog, os itens do topo devem ser:',
      options: [
        { id: 'a', text: 'Mais detalhados e bem entendidos do que os itens distantes na fila.' },
        { id: 'b', text: 'Deixados vagos enquanto os do fim do ano são super detalhados.' },
        { id: 'c', text: 'Ordenados exclusivamente por ordem alfabética.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Detalhar apenas o horizonte próximo evita desperdício de especificação caso prioridades mudem.',
    },
    {
      conceptId: 'backlog',
      statement: 'Qual a vantagem de escrever itens de backlog orientados ao problema do usuário?',
      options: [
        { id: 'a', text: 'Permite que design e engenharia encontrem a solução mais simples para gerar o impacto.' },
        { id: 'b', text: 'Obriga o time a copiar exatamente o código de um concorrente.' },
        { id: 'c', text: 'Elimina a necessidade de testes de usabilidade.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Focar no problema e critério de valor abre espaço para soluções mais inteligentes e rápidas.',
    },
    {
      conceptId: 'roadmap',
      statement: 'Por que o formato de roadmap "Now / Next / Later" funciona tão bem em startups?',
      options: [
        { id: 'a', text: 'Comunica prioridades estratégicas por horizonte sem prometer datas rígidas para incertezas distantes.' },
        { id: 'b', text: 'Prevê cada hora de trabalho dos próximos 36 meses.' },
        { id: 'c', text: 'Esconde os planos da própria equipe.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Now/Next/Later equilibra clareza estratégica com flexibilidade diante do aprendizado rápido.',
    },
    {
      conceptId: 'roadmap',
      statement: 'Qual é a principal diferença entre um Roadmap orientado a resultados (Outcomes) e um roadmap de entregas (Features)?',
      options: [
        { id: 'a', text: 'O roadmap de resultados foca nos problemas e métricas que queremos mover, não só em datas de telas.' },
        { id: 'b', text: 'O roadmap de resultados não tem relação com clientes.' },
        { id: 'c', text: 'Não há diferença prática entre os dois.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Roadmaps baseados em outcomes permitem adaptar a solução caso uma feature inicial não traga o efeito esperado.',
    },
    {
      conceptId: 'rice',
      statement: 'Ao comparar pedidos de clientes usando RICE, quando vale dar peso extra a uma solicitação?',
      options: [
        { id: 'a', text: 'Quando dados mostram alto alcance e impacto no objetivo estratégico atual.' },
        { id: 'b', text: 'Sempre que o pedido vier em letras maiúsculas.' },
        { id: 'c', text: 'Apenas quando o esforço for o maior possível.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Priorização saudável combina evidência de impacto com alinhamento ao objetivo do momento.',
    },
    {
      conceptId: 'roadmap',
      statement: 'Quem deve compreender o roadmap do produto em uma startup?',
      options: [
        { id: 'a', text: 'Produto, engenharia, vendas, suporte e liderança, cada um no nível adequado.' },
        { id: 'b', text: 'Apenas o CEO em uma planilha secreta.' },
        { id: 'c', text: 'Somente estagiários recém-chegados.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O roadmap é uma ferramenta de alinhamento coletivo sobre direção e prioridades.',
    },
    {
      conceptId: 'backlog',
      statement: 'O que fazer com dezenas de ideias antigas paradas há mais de 6 meses no backlog?',
      options: [
        { id: 'a', text: 'Arquivar ou limpar periodicamente para manter o backlog focado e gerenciável.' },
        { id: 'b', text: 'Deixar todas marcadas como urgentes para não perder nenhuma.' },
        { id: 'c', text: 'Parar todo desenvolvimento atual até executar todas elas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Se um problema for realmente importante, ele voltará a aparecer com evidências atualizadas.',
    },
  ],

  'pessoas-cultura': [
    {
      conceptId: 'feedback',
      statement: 'No modelo SBI de feedback, o que a sigla representa?',
      options: [
        { id: 'a', text: 'Situação, Comportamento observado e Impacto gerado.' },
        { id: 'b', text: 'Salário, Bônus e Indicadores.' },
        { id: 'c', text: 'Sistema, Backlog e Integração.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O modelo SBI evita julgamentos pessoais ao descrever fatos concretos e seus efeitos.',
    },
    {
      conceptId: 'feedback',
      statement: 'Qual prática torna o feedback construtivo mais fácil de ser aceito e aplicado?',
      options: [
        { id: 'a', text: 'Dar o feedback logo após o ocorrido, em conversa privada e focada em fatos.' },
        { id: 'b', text: 'Acumular críticas por meses e expor na reunião geral.' },
        { id: 'c', text: 'Falar sobre traços de personalidade em vez de ações.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Feedback oportuno, específico e respeitoso constrói confiança e acelera desenvolvimento.',
    },
    {
      conceptId: 'feedback',
      statement: 'O que significa "segurança psicológica" em um time de startup?',
      options: [
        { id: 'a', text: 'Ambiente onde pessoas podem expor erros, dúvidas e discordâncias sem medo de punição.' },
        { id: 'b', text: 'Ausência total de metas e cobranças de resultado.' },
        { id: 'c', text: 'Proibição de discordar da liderança em qualquer reunião.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Times com segurança psicológica identificam riscos e falhas mais cedo, inovando melhor.',
    },
    {
      conceptId: 'feedback',
      statement: 'Para que serve uma reunião 1:1 (One-on-One) bem conduzida?',
      options: [
        { id: 'a', text: 'Alinhar carreira, bloqueios, bem-estar e trocar feedback bidirecional.' },
        { id: 'b', text: 'Ler em voz alta a lista de tarefas do Jira.' },
        { id: 'c', text: 'Substituir toda documentação técnica do projeto.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A 1:1 é o espaço do liderado para conversar sobre desenvolvimento, contexto e apoio necessário.',
    },
    {
      conceptId: 'rituais',
      statement: 'Qual sinal indica que os rituais do time estão atrapalhando em vez de ajudar?',
      options: [
        { id: 'a', text: 'Reuniões sem pauta clara onde ninguém sai com decisão ou próximo passo.' },
        { id: 'b', text: 'Encontros curtos que começam e terminam no horário combinado.' },
        { id: 'c', text: 'Check-ins semanais que destravam dependências entre áreas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Todo ritual precisa ter propósito claro, participantes necessários e decisões registradas.',
    },
    {
      conceptId: 'rituais',
      statement: 'Em uma Retrospectiva, qual atitude gera planos de ação reais?',
      options: [
        { id: 'a', text: 'Escolher 1 ou 2 ações concretas com responsável e prazo para o próximo ciclo.' },
        { id: 'b', text: 'Listar 20 problemas sem definir quem fará nada.' },
        { id: 'c', text: 'Buscar culpados individuais pelos erros do sistema.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Poucas ações com dono claro têm muito mais chance de mudar a rotina do time.',
    },
    {
      conceptId: 'rituais',
      statement: 'Qual o objetivo de uma cerimônia de Demo / Showcase semanal em startups?',
      options: [
        { id: 'a', text: 'Celebrar avanços reais, dar visibilidade entre áreas e colher feedback rápido.' },
        { id: 'b', text: 'Cobrar horas extras da equipe de produto.' },
        { id: 'c', text: 'Apresentar apenas tarefas que ainda nem começaram.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Mostrar trabalho real funcionando conecta engenharia, produto e negócios.',
    },
    {
      conceptId: 'rituais',
      statement: 'Como evitar que rituais ocupem o dia inteiro de quem executa (Maker Schedule)?',
      options: [
        { id: 'a', text: 'Agrupar reuniões em blocos definidos e preservar janelas longas de foco sem interrupções.' },
        { id: 'b', text: 'Espalhar reuniões de 30 minutos a cada hora do dia.' },
        { id: 'c', text: 'Convidar toda a empresa para toda conversa operacional.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Blocos de trabalho profundo são essenciais para produtividade criativa e técnica.',
    },
    {
      conceptId: 'comunicacao-assincrona',
      statement: 'Qual é a principal vantagem da comunicação assíncrona bem estruturada?',
      options: [
        { id: 'a', text: 'Preservar o foco profundo, incluir pessoas em horários diferentes e gerar histórico pesquisável.' },
        { id: 'b', text: 'Eliminar completamente conversas síncronas mesmo em crises graves.' },
        { id: 'c', text: 'Mandar mensagens fragmentadas como "oi" e esperar resposta imediata.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Comunicação assíncrona dá autonomia e registra decisões para quem não estava online na hora.',
    },
    {
      conceptId: 'comunicacao-assincrona',
      statement: 'Ao enviar uma atualização assíncrona de projeto, o que não pode faltar?',
      options: [
        { id: 'a', text: 'Contexto resumido, o que foi decidido/feito, bloqueios e qual ação se espera de quem lê.' },
        { id: 'b', text: 'Apenas "depois conversamos na call".' },
        { id: 'c', text: 'Um texto longo sem título nem conclusão.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Mensagens completas em um único envio reduzem idas e vindas desnecessárias.',
    },
    {
      conceptId: 'comunicacao-assincrona',
      statement: 'Quando uma conversa assíncrona deve migrar imediatamente para uma chamada síncrona?',
      options: [
        { id: 'a', text: 'Em alinhamentos emocionais sensíveis, conflitos ou discussões que já passaram de 3 idas e vindas sem acordo.' },
        { id: 'b', text: 'Para avisar que uma tarefa simples foi movida no quadro.' },
        { id: 'c', text: 'Sempre que alguém quiser compartilhar um link de artigo.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Saber alternar entre síncrono e assíncrono evita ruídos emocionais e reuniões inúteis.',
    },
    {
      conceptId: 'comunicacao-assincrona',
      statement: 'Por que documentar decisões tomadas em reuniões em um canal público/wiki é vital em startups?',
      options: [
        { id: 'a', text: 'Evita retrabalho, facilita onboarding de novos membros e mantém transparência.' },
        { id: 'b', text: 'Apenas para aumentar o número de arquivos no Drive.' },
        { id: 'c', text: 'Para substituir o código-fonte do produto.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Sem registro escrito, startups perdem memória organizacional conforme o time cresce.',
    },
    {
      conceptId: 'feedback',
      statement: 'O feedback positivo (reconhecimento) deve ser:',
      options: [
        { id: 'a', text: 'Específico sobre o comportamento e o impacto gerado, reforçando boas práticas.' },
        { id: 'b', text: 'Evitado para não acostumar mal a equipe.' },
        { id: 'c', text: 'Genérico, como apenas "bom trabalho" uma vez por ano.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Reconhecer o que funcionou e por quê ajuda a pessoa e o time a repetirem comportamentos de sucesso.',
    },
    {
      conceptId: 'rituais',
      statement: 'Antes de criar um novo ritual semanal na equipe, o gestor deve perguntar:',
      options: [
        { id: 'a', text: 'Qual problema real essa reunião resolve que não poderia ser resolvido de forma assíncrona?' },
        { id: 'b', text: 'Como deixar a agenda de todos mais cheia?' },
        { id: 'c', text: 'Qual ferramenta de vídeo tem mais filtros?' },
      ],
      correctOptionId: 'a',
      explanation:
        'Questionar a necessidade do encontro evita burocracia em times enxutos.',
    },
  ],

  'metricas-riscos': [
    {
      conceptId: 'north-star',
      statement: 'O que define uma boa North Star Metric (Métrica Estrela Guia)?',
      options: [
        { id: 'a', text: 'Captura o momento central em que o cliente recebe valor e se correlaciona com crescimento sustentável.' },
        { id: 'b', text: 'Mede apenas quantas linhas de código o time escreveu na semana.' },
        { id: 'c', text: 'Considera somente visitas anônimas na página inicial sem retenção.' },
      ],
      correctOptionId: 'a',
      explanation:
        'A North Star conecta o valor entregue ao usuário com o sucesso de longo prazo do negócio.',
    },
    {
      conceptId: 'north-star',
      statement: 'Para uma plataforma de streaming de música, qual seria a melhor North Star Metric?',
      options: [
        { id: 'a', text: 'Total de horas ou faixas ouvidas por usuários ativos semanais.' },
        { id: 'b', text: 'Quantidade de notificações push disparadas.' },
        { id: 'c', text: 'Número de downloads do app sem criação de conta.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Tempo ouvindo música traduz diretamente o valor consumido pelo usuário.',
    },
    {
      conceptId: 'north-star',
      statement: 'Por que acompanhar métricas de guarda-chuva / equilíbrio (guardrail metrics) junto à North Star?',
      options: [
        { id: 'a', text: 'Para evitar otimizar uma métrica destruindo qualidade, margem ou satisfação do cliente.' },
        { id: 'b', text: 'Para confundir a equipe com dezenas de números sem conexão.' },
        { id: 'c', text: 'Porque a North Star nunca deve ser compartilhada.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Guardrails garantem crescimento saudável sem sacrificar experiência ou sustentabilidade financeira.',
    },
    {
      conceptId: 'burn-rate',
      statement: 'O que significa "Net Burn Rate" de uma startup?',
      options: [
        { id: 'a', text: 'O quanto de caixa líquido a empresa consome por mês após descontar as receitas.' },
        { id: 'b', text: 'A velocidade média de entrega de histórias no Scrum.' },
        { id: 'c', text: 'A taxa de cliques em anúncios pagos.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Net Burn = despesas mensais menos receitas mensais; indica o consumo real do caixa.',
    },
    {
      conceptId: 'burn-rate',
      statement: 'Se uma startup tem R$ 600 mil em caixa e seu Net Burn Rate é de R$ 50 mil/mês, qual é seu Runway?',
      options: [
        { id: 'a', text: '12 meses.' },
        { id: 'b', text: '6 meses.' },
        { id: 'c', text: '30 meses.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Runway = Caixa disponível / Net Burn mensal = 600.000 / 50.000 = 12 meses.',
    },
    {
      conceptId: 'burn-rate',
      statement: 'Por que gestores de produto precisam entender Burn Rate e Runway?',
      options: [
        { id: 'a', text: 'Para calibrar apostas entre experimentos rápidos e projetos longos dentro do tempo de vida do caixa.' },
        { id: 'b', text: 'Para assumir o trabalho do contador na emissão de notas.' },
        { id: 'c', text: 'Para justificar aumento infinito de escopo sem metas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Cada semana de desenvolvimento consome runway; priorizar certo é uma decisão financeira também.',
    },
    {
      conceptId: 'velocity',
      statement: 'Como a métrica Velocity deve ser utilizada por um time ágil?',
      options: [
        { id: 'a', text: 'Internamente pelo próprio time para ganhar previsibilidade de capacidade entre sprints.' },
        { id: 'b', text: 'Para comparar e ranquear times diferentes com contextos distintos.' },
        { id: 'c', text: 'Como meta de bônus para forçar inflação artificial de pontos.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Comparar Velocity entre times ou usá-la como meta punitiva destorce as estimativas.',
    },
    {
      conceptId: 'velocity',
      statement: 'O que acontece quando a liderança pressiona um time para dobrar sua Velocity artificialmente?',
      options: [
        { id: 'a', text: 'As estimativas em pontos são infladas e a qualidade cai, sem aumento real de valor entregue.' },
        { id: 'b', text: 'O produto ganha Product-Market Fit automaticamente.' },
        { id: 'c', text: 'Os bugs desaparecem do sistema.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Lei de Goodhart: quando uma medida vira meta punitiva, ela deixa de ser uma boa medida.',
    },
    {
      conceptId: 'velocity',
      statement: 'Além de pontos por sprint, qual métrica complementar ajuda a prever prazos de entrega?',
      options: [
        { id: 'a', text: 'Throughput (itens concluídos por período) e Cycle Time histórico.' },
        { id: 'b', text: 'Número de cafés consumidos na semana.' },
        { id: 'c', text: 'Tamanho do documento de requisitos em páginas.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Dados históricos de fluxo (Throughput e Cycle Time) oferecem previsões baseadas em fatos reais.',
    },
    {
      conceptId: 'gestao-riscos',
      statement: 'Em uma Matriz de Riscos (Probabilidade × Impacto), quais riscos exigem plano imediato de mitigação?',
      options: [
        { id: 'a', text: 'Os de alta probabilidade e alto impacto para o negócio ou usuário.' },
        { id: 'b', text: 'Apenas os de impacto insignificante e probabilidade quase nula.' },
        { id: 'c', text: 'Somente riscos já ocorridos há dois anos.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Priorizar o quadrante crítico concentra energia no que realmente pode inviabilizar o projeto.',
    },
    {
      conceptId: 'gestao-riscos',
      statement: 'Como funciona a técnica de "Pre-mortem" antes de lançar um projeto importante?',
      options: [
        { id: 'a', text: 'O time imagina que o projeto falhou no futuro e lista causas prováveis para preveni-las hoje.' },
        { id: 'b', text: 'Espera-se o projeto fracassar para só então analisar o que ocorreu.' },
        { id: 'c', text: 'Proíbe-se levantar preocupações antes do lançamento.' },
      ],
      correctOptionId: 'a',
      explanation:
        'O pre-mortem dá permissão segura para revelar riscos ocultos enquanto ainda há tempo de agir.',
    },
    {
      conceptId: 'gestao-riscos',
      statement: 'Quais são as quatro respostas clássicas a um risco identificado em projetos?',
      options: [
        { id: 'a', text: 'Evitar, Mitigar, Transferir ou Aceitar.' },
        { id: 'b', text: 'Ignorar, Adiar, Esconder ou Culpar.' },
        { id: 'c', text: 'Copiar, Colar, Imprimir ou Arquivar.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Nem todo risco precisa ser eliminado; decidir conscientemente entre mitigar, transferir, evitar ou aceitar dá controle.',
    },
    {
      conceptId: 'north-star',
      statement: 'O que diferencia uma métrica "leading" (antecedente) de uma "lagging" (atrasada)?',
      options: [
        { id: 'a', text: 'Leading indica sinais precoces de tendência (ex.: ativação), enquanto lagging reflete resultado consolidado (ex.: receita anual).' },
        { id: 'b', text: 'Lagging é sempre mais rápida de mudar do que leading.' },
        { id: 'c', text: 'Não existe relação entre sinais precoces e receita futura.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Métricas antecedentes ajudam o time a agir cedo antes que o resultado final seja afetado.',
    },
    {
      conceptId: 'burn-rate',
      statement: 'Quando o runway de uma startup cai abaixo de 6 meses, qual deve ser a prioridade de gestão?',
      options: [
        { id: 'a', text: 'Ajustar gastos, focar em receita/marcos essenciais de tração e iniciar captação ou plano de sobrevivência.' },
        { id: 'b', text: 'Contratar o dobro de pessoas sem validar vendas.' },
        { id: 'c', text: 'Deixar de acompanhar o fluxo de caixa.' },
      ],
      correctOptionId: 'a',
      explanation:
        'Rodadas ou ajustes operacionais levam meses; agir com antecedência evita ficar sem caixa.',
    },
  ],
};

function buildRotatedVariants(moduleSlug: string, pool: PoolQuestion[]): AssessmentVariantDoc[] {
  const variants: AssessmentVariantDoc[] = [];

  for (let vIdx = 0; vIdx < 10; vIdx += 1) {
    const questions: AssessmentQuestionDoc[] = [];
    const stride = (vIdx % 3) + 1;

    const pickedIndices = new Set<number>();
    let cursor = (vIdx * 3) % pool.length;
    while (pickedIndices.size < ASSESSMENT_QUESTIONS_COUNT) {
      if (!pickedIndices.has(cursor)) {
        pickedIndices.add(cursor);
      }
      cursor = (cursor + stride) % pool.length;
      if (pickedIndices.has(cursor)) {
        cursor = (cursor + 1) % pool.length;
      }
    }

    Array.from(pickedIndices).forEach((qPoolIdx, qOrder) => {
      const source = pool[qPoolIdx];
      // Rotaciona ordem das opções de forma determinística por variante para evitar padrão fixo na letra "A"
      const shift = (vIdx + qOrder) % source.options.length;
      const rotatedTexts = source.options.map(
        (_, idx) => source.options[(idx + shift) % source.options.length],
      );
      const letterIds = ['a', 'b', 'c'];
      const mappedOptions = rotatedTexts.map((opt, idx) => ({
        id: letterIds[idx],
        text: opt.text,
      }));
      const newCorrectIdx = rotatedTexts.findIndex((opt) => opt.id === source.correctOptionId);

      questions.push({
        id: `${moduleSlug}-v${vIdx + 1}-q${qOrder + 1}`,
        statement: source.statement,
        conceptId: source.conceptId,
        options: mappedOptions,
        correctOptionId: letterIds[newCorrectIdx >= 0 ? newCorrectIdx : 0],
        explanation: source.explanation,
      });
    });

    variants.push({
      variantId: `v${vIdx + 1}`,
      questions,
    });
  }

  return variants;
}

export function buildSeedAssessmentBanks(): Array<{
  moduleSlug: string;
  variants: AssessmentVariantDoc[];
}> {
  return Object.entries(QUESTION_POOLS_BY_SLUG).map(([moduleSlug, pool]) => ({
    moduleSlug,
    variants: buildRotatedVariants(moduleSlug, pool),
  }));
}
