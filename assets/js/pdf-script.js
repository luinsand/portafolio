document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica para el botón de descarga de PDF
    const downloadPdfButton = document.getElementById('download-pdf-button');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const element = document.getElementById('main-content-pdf'); // Content to be converted
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5], // inches, matches @page margin in CSS
                filename: 'Portafolio_MM_Seguridad_Integral.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: false, useCORS: true },
                jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }, // Use A4 format as discussed
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };
            html2pdf().from(element).set(opt).save();
        });
    }

    // 2. Lógica para transformar elementos tech-term
    const techTerms = document.querySelectorAll('.tech-term');
    techTerms.forEach(term => {
        const titleContent = term.getAttribute('title');
        if (titleContent) {
            // Create a new span/paragraph to display the title content
            const detailSpan = document.createElement('span');
            detailSpan.className = 'tech-term-detail';
            detailSpan.textContent = titleContent;

            // Insert it after the tech-term span
            term.parentNode.insertBefore(detailSpan, term.nextSibling);

            // Optionally, remove the title attribute to prevent browser tooltips
            term.removeAttribute('title');
        }
    });

    // 3. Opcional: Asegurar que todos los collapsibles estén abiertos si no se maneja solo con CSS
    // Con la clase 'collapsible-content-pdf' y el CSS, esto debería ser redundante,
    // pero es un fallback si algo fallara o si se necesitara manipulación más compleja.
    const collapsibleContents = document.querySelectorAll('.collapsible-content, .collapsible-content-pdf');
    collapsibleContents.forEach(content => {
        content.style.display = 'block';
        content.style.height = 'auto';
        content.style.opacity = '1';
        content.style.visibility = 'visible';
        content.style.overflow = 'visible';
    });

    console.log('PDF Script cargado. Botón de descarga y transformación de términos técnicos listos.');
});
