const links = [
    {
        title: 'Upload',
        url: 'https://apfs.xyz/upload'
    },
    {
        title: 'Minecraft',
        url: 'https://apfs.xyz/mc'
    }
    // Add more
];

function featuredPage() {
    // Select a random subpage
    let link = links[Math.floor(Math.random() * links.length)];

    // Get elements by ID
    let elements = {};
    elements.featuredTitle = document.getElementById('featured-title');
    elements.featuredLink = document.getElementById('featured-link');

    // Set the content to the random subpage
    elements.featuredTitle.innerHTML = `Random page: ${link.title}`;
    elements.featuredLink.href = link.url;
}