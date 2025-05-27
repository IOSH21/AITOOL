# Interactive Research Web Visualization Tool

This tool allows users to input URLs of web pages, extracts key information (title, text content, keywords), and visualizes the relationships between these pages as an interactive network graph. Nodes in the graph represent individual web pages, and connections are formed based on shared concepts or keywords.

## Features (Current - Phase 1)

*   **URL Input:** Paste URLs to add them to the visualization.
*   **Content Extraction:** Fetches the web page and extracts its title and main text content.
*   **Keyword Extraction:** Identifies key terms from the page content.
*   **Network Graph:** Displays pages as nodes and connects them based on shared keywords.
*   **Interactive Visualization:**
    *   Draggable nodes.
    *   Zoom and pan functionality.
    *   Hover over edges to see shared keywords.

## How to Run

1.  Clone this repository (or download the files).
2.  Open the `index.html` file in a modern web browser that supports JavaScript.
3.  Paste URLs into the input field and click "Add URL".

## Tech Stack (Core)

*   Frontend: HTML, CSS, JavaScript
*   Visualization Library: `vis-network.js`

## Future Development

This is the initial version. Future enhancements may include:
*   More sophisticated text analysis (TF-IDF, named entity recognition).
*   Node sizing based on content richness or importance.
*   Varying connection line strength based on similarity.
*   Content previews on hover/click.
*   Advanced discovery features (e.g., "find connections", clustering).
*   Local browser storage for persistence.
*   Backend support for robust URL fetching (to handle CORS issues).

---
*This project was initially an empty repository and is being developed by an AI assistant.*