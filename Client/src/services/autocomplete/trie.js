class QueryAutocomplete {
    constructor() {
        this.trie = new Trie();
        this.loadFromLocalStorage(); // Load saved queries into Trie
    }

    // Load queries from localStorage and populate Trie
    loadFromLocalStorage() {
        let savedQueries = localStorage.getItem("queryBuffer"); // Fetch stored queries as string
        if (savedQueries) {
            let queryArray = savedQueries.split(","); // Convert comma-separated string to an array
            queryArray.slice(0, 100).forEach((query) => this.insert(query.trim())); // Load up to 100 queries
        }
    }

    // Insert query into Trie
    insert(query) {
        this.trie.insert(query);
    }

    // Search autocomplete suggestions from Trie
    getSuggestions(prefix) {
        return this.trie.getWordsWithPrefix(prefix);
    }

    // Add new query to buffer (if not already present)
    addToBuffer(query) {
        let savedQueries = localStorage.getItem("queryBuffer") || "";
        let queryArray = savedQueries ? savedQueries.split(",") : [];

        if (!queryArray.includes(query)) {
            queryArray.push(query);
            localStorage.setItem("queryBuffer", queryArray.join(",")); // Save back as a comma-separated string
            this.insert(query); // Also insert into Trie
        }
    }

    // Fetch new queries when connecting a DB
    async fetchNewQueries(dbMetadata) {
        try {
            const response = await fetch("/api/generate-queries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ metadata: dbMetadata }),
            });

            if (!response.ok) throw new Error("Failed to fetch queries");

            const data = await response.json();
            if (data.queries && Array.isArray(data.queries)) {
                data.queries.forEach((query) => this.addToBuffer(query));
            }
        } catch (error) {
            console.error("Error fetching queries:", error);
        }
    }
}

// Basic Trie implementation
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

    getWordsWithPrefix(prefix) {
        let node = this.root;
        for (let char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        return this.collectWords(node, prefix);
    }

    collectWords(node, prefix) {
        let words = [];
        if (node.isEndOfWord) words.push(prefix);

        for (let char in node.children) {
            words = words.concat(this.collectWords(node.children[char], prefix + char));
        }

        return words;
    }
}

// Initialize and export
const queryAutocomplete = new QueryAutocomplete();
export default queryAutocomplete;