const links = [
    {
        title: 'Upload',
        url: 'https://apfs.xyz/upload'
    },
    {
        title: 'Minecraft',
        url: 'https://apfs.xyz/mc'
    },
    // Add more
];

let featuredLink = function() {
    let link = links[Math.floor(Math.random() * links.length)];
    let featuredTitle = document.getElementById('featured-title');
    let featuredLink = document.getElementById('featured-link');

    featuredTitle.innerHTML = link.title;
    featuredLink.href = link.url;
}