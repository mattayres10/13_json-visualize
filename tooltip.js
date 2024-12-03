// Create a tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
tooltip.style.color = 'white';
tooltip.style.padding = '8px 12px';
tooltip.style.borderRadius = '8px';
tooltip.style.fontSize = '12px';
tooltip.style.fontFamily = 'Arial, sans-serif';
tooltip.style.pointerEvents = 'none';
tooltip.style.zIndex = '1000';
tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

// Add event listeners to display tooltip on hover
document.addEventListener('mouseover', (e) => {
    const element = e.target;

    // Get computed styles for the element
    const styles = window.getComputedStyle(element);

    // Build the DOM hierarchy
    let domPath = [];
    let current = element;
    while (current) {
        const tag = current.tagName.toLowerCase();
        const id = current.id ? `#${current.id}` : '';
        const classes = current.className ? `.${current.className.split(' ').join('.')}` : '';
        domPath.unshift(`${tag}${id}${classes}`);
        current = current.parentElement;
    }

    // Set tooltip content with additional details
    tooltip.innerHTML = `
        <strong>Tag:</strong> ${element.tagName.toLowerCase()}<br>
        <strong>Classes:</strong> ${element.className || 'None'}<br>
        <strong>ID:</strong> ${element.id || 'None'}<br>
        <strong>Margin:</strong> ${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}<br>
        <strong>Padding:</strong> ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}<br>
        <strong>Dimensions:</strong> ${element.offsetWidth}px x ${element.offsetHeight}px<br>
        <strong>DOM Path:</strong> ${domPath.join(' > ')}
    `;

    // Position and display the tooltip
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
    tooltip.style.display = 'block';
});

document.addEventListener('mousemove', (e) => {
    // Update tooltip position as the mouse moves
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
});

document.addEventListener('mouseout', () => {
    // Hide tooltip when the mouse leaves an element
    tooltip.style.display = 'none';
});

document.addEventListener('click', (e) => {
    console.log(`Mouse clicked at X: ${e.pageX}, Y: ${e.pageY}`);
});

