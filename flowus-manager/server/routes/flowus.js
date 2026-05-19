import express from 'express';

const router = express.Router();

const FLOWUS_API_BASE = 'https://api.flowus.cn/v1';

router.get('/test', async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/spaces`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Invalid token or API error',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to FlowUs API' });
  }
});

router.get('/pages', async (req, res) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/spaces`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch pages',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('FlowUs API error:', error);
    res.status(500).json({ error: 'Failed to fetch from FlowUs API' });
  }
});

router.get('/pages/:id', async (req, res) => {
  const { token } = req.headers;
  const { id } = req.params;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/pages/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Page not found',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('FlowUs API error:', error);
    res.status(500).json({ error: 'Failed to fetch page from FlowUs API' });
  }
});

router.get('/articles', async (req, res) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/spaces`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch articles',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('FlowUs API error:', error);
    res.status(500).json({ error: 'Failed to fetch from FlowUs API' });
  }
});

router.get('/analytics', async (req, res) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Failed to fetch analytics',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('FlowUs API error:', error);
    res.status(500).json({ error: 'Failed to fetch from FlowUs API' });
  }
});

router.post('/sync', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await fetch(`${FLOWUS_API_BASE}/spaces`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Sync failed',
        status: response.status 
      });
    }

    const data = await response.json();
    res.json({ 
      success: true, 
      message: 'Data synchronized successfully',
      data,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('FlowUs sync error:', error);
    res.status(500).json({ error: 'Failed to sync with FlowUs API' });
  }
});

export default router;
