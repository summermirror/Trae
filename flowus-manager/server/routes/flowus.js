import express from 'express';

const router = express.Router();

const FLOWUS_API_BASE = 'https://api.flowus.cn/v1';

// Mock data for demonstration
const mockPapers = [
  {
    id: 'paper-1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    journal: 'NeurIPS',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    keywords: ['transformer', 'attention', 'neural networks', 'NLP'],
    tags: ['classic', 'important']
  },
  {
    id: 'paper-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    journal: 'ACL',
    year: 2019,
    doi: '10.18653/v1/N19-1423',
    url: 'https://arxiv.org/abs/1810.04805',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations by jointly conditioning on both left and right context in all layers.',
    keywords: ['BERT', 'transformer', 'pre-training', 'language model'],
    tags: ['important', 'classic']
  },
  {
    id: 'paper-3',
    title: 'Generative Pre-training with Transformers',
    authors: ['Radford, Alec'],
    journal: 'OpenAI',
    year: 2018,
    doi: '',
    url: 'https://openai.com/research/language-unsupervised',
    abstract: 'This paper presents a simple method for effectively training generative models on large unlabeled datasets, and fine-tuning them for specific natural language understanding tasks.',
    keywords: ['GPT', 'generative models', 'transformers'],
    tags: ['important']
  },
  {
    id: 'paper-4',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: ['Tom Brown', 'Benjamin Mann', 'Nick Ryder', 'Melanie Subbiah'],
    journal: 'NeurIPS',
    year: 2020,
    doi: '10.48550/arXiv.2005.14165',
    url: 'https://arxiv.org/abs/2005.14165',
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples.',
    keywords: ['GPT-3', 'few-shot learning', 'language models', 'large models'],
    tags: ['important']
  }
];

// Test connection with optional API token validation
router.get('/test', async (req, res) => {
  const { token } = req.headers;
  
  console.log('Test endpoint called with token:', token ? 'provided' : 'not provided');
  
  if (!token) {
    return res.json({ 
      success: false, 
      error: 'Token is required',
      message: 'Please configure your API token in settings'
    });
  }

  // For now, let's validate token format and return success
  // Real API integration would require actual FlowUs endpoint
  if (token && token.length > 10) {
    return res.json({ 
      success: true, 
      message: 'API connection validated (token format correct)',
      data: { token: token.substring(0, 10) + '...', tokenLength: token.length }
    });
  } else {
    return res.json({ 
      success: false, 
      error: 'Invalid token format',
      message: 'Please provide a valid FlowUs API token'
    });
  }
});

// Get pages with mock data support
router.get('/pages', async (req, res) => {
  const { token } = req.headers;
  
  console.log('Pages endpoint called');
  
  // Return mock data for demonstration
  res.json(mockPapers.map(p => ({
    id: p.id,
    title: p.title,
    authors: p.authors,
    journal: p.journal,
    year: p.year,
    doi: p.doi,
    url: p.url,
    abstract: p.abstract,
    keywords: p.keywords,
    tags: p.tags
  })));
});

// Get specific page
router.get('/pages/:id', async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  
  console.log('Page endpoint called for ID:', id);
  
  // Return mock data for demonstration
  const paper = mockPapers.find(p => p.id === id);
  if (paper) {
    res.json({
      success: true,
      data: paper
    });
  } else {
    res.json({
      success: true,
      data: mockPapers[0] // Return first paper as default
    });
  }
});

// Get articles
router.get('/articles', async (req, res) => {
  const { token } = req.headers;
  
  console.log('Articles endpoint called');
  
  // Return mock articles
  res.json([
    {
      id: 'article-1',
      title: 'Getting Started with Machine Learning',
      updatedAt: new Date().toISOString(),
      views: 1234,
      content: 'This is a sample article about machine learning...'
    },
    {
      id: 'article-2',
      title: 'Understanding Neural Networks',
      updatedAt: new Date().toISOString(),
      views: 567,
      content: 'Neural networks are powerful tools for pattern recognition...'
    },
    {
      id: 'article-3',
      title: 'Modern NLP Techniques',
      updatedAt: new Date().toISOString(),
      views: 890,
      content: 'Natural language processing has advanced greatly in recent years...'
    }
  ]);
});

// Get analytics
router.get('/analytics', async (req, res) => {
  const { token } = req.headers;
  
  console.log('Analytics endpoint called');
  
  // Return mock analytics
  res.json({
    totalViews: 10000,
    totalArticles: 15,
    totalPages: 25,
    recentViews: [
      { date: '2026-05-10', views: 120 },
      { date: '2026-05-11', views: 135 },
      { date: '2026-05-12', views: 150 },
      { date: '2026-05-13', views: 140 },
      { date: '2026-05-14', views: 160 },
      { date: '2026-05-15', views: 180 },
      { date: '2026-05-16', views: 175 }
    ],
    topPages: [
      { title: 'About Me', views: 2500 },
      { title: 'Blog', views: 1800 },
      { title: 'Projects', views: 1200 },
      { title: 'Publications', views: 900 }
    ]
  });
});

// Sync data endpoint
router.post('/sync', async (req, res) => {
  const { token } = req.body;
  
  console.log('Sync endpoint called');
  
  try {
    // For now, return mock data for synchronization
    // In future, this will integrate with real FlowUs API
    res.json({ 
      success: true, 
      message: 'Data synchronized successfully (using mock data)',
      data: mockPapers,
      count: mockPapers.length,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Sync papers specifically
router.post('/sync-papers', async (req, res) => {
  const { token, pageId } = req.body;
  
  console.log('Sync papers endpoint called with pageId:', pageId);
  
  try {
    res.json({ 
      success: true, 
      message: 'Papers synchronized successfully',
      papers: mockPapers,
      count: mockPapers.length,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Papers sync error:', error);
    res.status(500).json({ error: 'Failed to sync papers' });
  }
});

export default router;
