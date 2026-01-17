// Lógica para la funcionalidad del sitio de MM Seguridad Integral

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL PRELOADER ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('preloader-hidden');
        }
    });

    // --- FUNCIÓN DE EXPORTACIÓN A PDF (CON html2pdf.js) ---
    const exportButton = document.getElementById('export-pdf');
    if (exportButton) {
        exportButton.addEventListener('click', generatePdfWithHtml2Pdf);
    }

    function generatePdfWithHtml2Pdf() {
        const mainContent = document.getElementById('main-content');
        const body = document.body;

        // Add a class to the body to apply print-specific styles
        body.classList.add('pdf-export-mode');

        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5], // inches
            filename: 'Portafolio_MM_Seguridad_Integral.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate the PDF
        html2pdf().from(mainContent).set(opt).save().then(() => {
            // Remove the class after the PDF has been generated
            body.classList.remove('pdf-export-mode');
        });
    }

    // --- LÓGICA PARA ELEMENTOS COLAPSABLES (ACORDEÓN) ---
    const collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
    collapsibleTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // The parent '.collapsible' element
            const parentCollapsible = this.closest('.collapsible');
            if (parentCollapsible) {
                parentCollapsible.classList.toggle('active');

                // Update ARIA attribute for accessibility
                const content = parentCollapsible.querySelector('.collapsible-content');
                if (parentCollapsible.classList.contains('active')) {
                    this.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                } else {
                    this.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                }
            }
        });

        // Initialize ARIA attributes
        const parent = trigger.closest('.collapsible');
        if(parent) {
            const content = parent.querySelector('.collapsible-content');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', content.id || (content.id = 'collapsible-' + Math.random().toString(36).substr(2, 9)));
            content.setAttribute('aria-hidden', 'true');
        }
    });

    // --- LÓGICA PARA POPOVERS DE TÉRMINOS TÉCNICOS ---
    const techTerms = document.querySelectorAll('.tech-term');
    let activePopover = null;

    function removeActivePopover() {
        if (activePopover) {
            activePopover.classList.remove('visible');
            setTimeout(() => {
                if(activePopover) activePopover.remove();
                activePopover = null;
            }, 300); // Wait for transition to finish
        }
    }

    techTerms.forEach(term => {
        term.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el click cierre el popover inmediatamente
            
            // Si ya hay un popover y es de este término, lo cerramos.
            if (activePopover && activePopover.dataset.owner === term) {
                removeActivePopover();
                return;
            }

            // Si hay otro popover abierto, lo cerramos primero.
            removeActivePopover();
            
            const popoverContent = term.getAttribute('title');
            if (!popoverContent) return;

            // Crear el popover
            const popover = document.createElement('div');
            popover.className = 'tech-popover';
            popover.textContent = popoverContent;
            popover.dataset.owner = term; // Referencia al dueño
            document.body.appendChild(popover);
            
            // Posicionar el popover
            const termRect = term.getBoundingClientRect();
            popover.style.left = `${termRect.left + (termRect.width / 2) - (popover.offsetWidth / 2)}px`;
            popover.style.top = `${termRect.bottom + window.scrollY + 10}px`;

            // Mostrar con una pequeña transición
            setTimeout(() => {
                popover.classList.add('visible');
            }, 10);
            
            activePopover = popover;
        });
    });

    // Event listener para cerrar el popover al hacer click en cualquier otro lugar
    document.addEventListener('click', () => {
        removeActivePopover();
    });

    // --- LÓGICA PARA ANIMACIONES AL HACER SCROLL ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el elemento es un grid de servicios, animar sus hijos escalonadamente
                if (entry.target.classList.contains('services-grid')) {
                    const cards = entry.target.querySelectorAll('.reveal-on-scroll');
                    cards.forEach((card, index) => {
                        card.style.transitionDelay = `${index * 100}ms`;
                        card.classList.add('is-visible');
                    });
                } else {
                    // Para otros elementos, solo hacerlos visibles
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target); // Dejar de observar el elemento una vez que la animación ha comenzado
            }
        });
    }, observerOptions);

    // Observar todos los elementos que deben revelarse
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });

    console.log('Script cargado. Interactividad, animaciones y exportación a PDF listas.');

});