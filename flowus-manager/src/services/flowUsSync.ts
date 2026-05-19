import type { Paper } from '../types/paper';
import { paperStorage } from './paperManager';

export async function fetchFlowUsPage(pageId: string, token: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:3001/api/flowus/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch FlowUs page');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching FlowUs page:', error);
    throw error;
  }
}

export function parseFlowUsPapers(data: any, sourceUrl: string): Paper[] {
  const papers: Paper[] = [];

  const extractPapersFromNode = (node: any) => {
    if (!node) return;

    if (node.properties) {
      const props = node.properties;
      
      if (props.title || node.title) {
        const paper: Paper = {
          id: crypto.randomUUID(),
          title: props.title || node.title || 'Untitled',
          authors: Array.isArray(props.authors) ? props.authors : 
                   (typeof props.authors === 'string' ? props.authors.split(/[,，;；]/).map((a: string) => a.trim()) : []),
          journal: props.journal,
          year: props.year ? parseInt(props.year) : undefined,
          doi: props.doi,
          url: props.url,
          abstract: props.abstract,
          keywords: Array.isArray(props.keywords) ? props.keywords : 
                   (typeof props.keywords === 'string' ? props.keywords.split(/[,，;；]/).map((k: string) => k.trim()) : []),
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importedFrom: sourceUrl,
        };

        if (paper.title && paper.title !== 'Untitled') {
          papers.push(paper);
        }
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => extractPapersFromNode(child));
    }

    if (Array.isArray(node)) {
      node.forEach((item: any) => extractPapersFromNode(item));
    }
  };

  extractPapersFromNode(data);

  return papers;
}

export async function syncPapersFromFlowUs(
  pageId: string,
  token: string,
  sourceUrl: string
): Promise<number> {
  const data = await fetchFlowUsPage(pageId, token);
  const papers = parseFlowUsPapers(data, sourceUrl);
  
  if (papers.length > 0) {
    papers.forEach(paper => paperStorage.addPaper(paper));
  }
  
  return papers.length;
}

export function exportPapersToLocalStorage(papers: Paper[]): void {
  paperStorage.savePapers(papers);
}

export function importPapersFromLocalStorage(): Paper[] {
  return paperStorage.loadPapers();
}

export function getPaperCount(): number {
  return paperStorage.loadPapers().length;
}

export function clearAllPapers(): void {
  paperStorage.clearAll();
}
