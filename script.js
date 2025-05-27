// JavaScript logic will go here in subsequent steps.
console.log("script.js loaded");

let processedPages = [];

function extractKeywords(text, numKeywords = 10) {
    if (!text) return [];
    const stopWords = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"];
    
    const cleanedText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const words = cleanedText.split(/\s+/);
    
    const freqMap = {};
    words.forEach(word => {
        if (word.length < 3 || stopWords.includes(word)) return;
        freqMap[word] = (freqMap[word] || 0) + 1;
    });
    
    return Object.keys(freqMap)
        .sort((a, b) => freqMap[b] - freqMap[a])
        .slice(0, numKeywords);
}

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const addUrlButton = document.getElementById('addUrlButton');

    // Initialize vis.DataSet for nodes and edges
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]); // We'll use this in the next step

    const container = document.getElementById('network-graph-container');
    const data = { nodes: nodes, edges: edges };
    const options = { // Basic options, can be expanded
        nodes: {
            shape: 'dot',
            size: 16
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {iterations: 150}
        }
    };
    if (container) {
        const network = new vis.Network(container, data, options);
    } else {
        console.error("Network graph container not found!");
    }

    function updateGraph() {
        // Node creation (as before)
        const newNodes = processedPages.map(page => ({
            id: page.url,
            label: page.title || 'Untitled',
            title: page.url 
        }));
        nodes.clear();
        nodes.add(newNodes);

        // Edge creation
        const newEdges = [];
        if (processedPages.length > 1) { // Only attempt to create edges if there are at least two pages
            for (let i = 0; i < processedPages.length; i++) {
                for (let j = i + 1; j < processedPages.length; j++) {
                    const pageA = processedPages[i];
                    const pageB = processedPages[j];

                    if (pageA && pageB && pageA.keywords && pageB.keywords) { // Ensure pages and keywords exist
                        const sharedKeywords = pageA.keywords.filter(keyword => pageB.keywords.includes(keyword));

                        if (sharedKeywords.length > 0) {
                            newEdges.push({
                                from: pageA.url,
                                to: pageB.url,
                                title: 'Shared: ' + sharedKeywords.join(', ') 
                            });
                        }
                    }
                }
            }
        }
        edges.clear();
        edges.add(newEdges);
        console.log("Updated graph with new edges:", newEdges); // For debugging
    }

    if (addUrlButton) {
        addUrlButton.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                console.log(`Fetching URL: ${url}`);
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        console.log("Fetched content (first 500 chars):", html.substring(0, 500)); // Keep this for now

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');

                        const title = doc.querySelector('title')?.innerText || 'No title found';
                        const bodyText = doc.body?.innerText || 'No body text found';

                        console.log("Extracted Title:", title);
                        console.log("Extracted Body Text (first 200 chars):", bodyText.substring(0, 200));

                        const keywords = extractKeywords(bodyText);
                        console.log("Extracted Keywords:", keywords);

                        const pageData = { url: url, title, bodyText, keywords }; // 'url' is from the click handler's scope
                        processedPages.push(pageData);
                        console.log("Processed Pages Data:", processedPages);
                        updateGraph(); // Add this call
                    })
                    .catch(error => {
                        console.error("Fetch error:", error);
                        alert(`Error fetching URL: ${error.message}. Check console for details. (Note: CORS issues are common with client-side fetching.)`);
                    });
                urlInput.value = ''; // Clear input field
            } else {
                alert("Please enter a URL.");
            }
        });
    } else {
        console.error("Add URL button not found");
    }
});
