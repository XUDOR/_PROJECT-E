document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const tableBody = document.querySelector('#parsed-data-table tbody');
    const loadingIndicator = document.querySelector('.loading');

    // Initialize the app
    function init() {
        fetchParsedData();
        setupNavLinks();
        handleWindowResize();
    }

    // Fetch and populate parsed data
    async function fetchParsedData() {
        showLoading();
        try {
            const response = await fetch('/api/display');
            const data = await response.json();

            populateTable(data);
        } catch (error) {
            console.error('Error fetching parsed data:', error);
        } finally {
            hideLoading();
        }
    }

    // Populate table with data
    function populateTable(data) {
        tableBody.innerHTML = ''; // Clear any existing rows

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.fileName}</td>
                <td>${new Date(item.scannedAt).toLocaleString()}</td>
                <td>
                    <ul>
                        <li><strong>IP:</strong> ${item.metadata.IP || 'N/A'}</li>
                        <li><strong>Section 1:</strong> ${item.metadata.section1 || 'N/A'}</li>
                        <li><strong>Categories:</strong> ${item.metadata.categories?.join(', ') || 'N/A'}</li>
                    </ul>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Setup navigation links
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const section = this.dataset.section;
                handleNavigation(section);
            });
        });
    }

    // Handle navigation with loading state
    function handleNavigation(section) {
        showLoading();
        setTimeout(() => {
            hideLoading();
            updateContent(section);
        }, 1000);
    }

    // Update content based on section
    function updateContent(section) {
        console.log(`Navigating to ${section}`);
        // Add logic to dynamically update the page content if needed
    }

    // Handle window resize with debouncing
    function handleWindowResize() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log('Window resized - layout adjusted');
            }, 250);
        });
    }

    // Loading state functions
    function showLoading() {
        loadingIndicator.style.display = 'block';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // Initialize app
    init();
});
