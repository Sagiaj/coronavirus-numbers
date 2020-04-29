export interface Trie {
  child?: TrieNode;
  isWord?: boolean;
  context?: any;
}

export interface TrieNode {
  [key: string]: Trie;
}

export interface TrieSearchResult {
  word: string;
  context: any
};
