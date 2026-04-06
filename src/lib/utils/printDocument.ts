/**
 * Print Document Utility
 * Creates a clean print output with only the document content
 */

interface PrintOptions {
  documentTitle?: string;
  documentNumber?: string;
}

export function printDocument(
  contentRef: React.RefObject<HTMLElement>,
  options: PrintOptions = {}
) {
  const { documentTitle = 'Document', documentNumber = '' } = options;

  // Create a dedicated print container
  const printContainer = document.createElement('div');
  printContainer.id = 'print-container';
  printContainer.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    z-index: 99999;
    padding: 10mm;
  `;

  // Clone the document content
  if (contentRef.current) {
    const clone = contentRef.current.cloneNode(true) as HTMLElement;

    // Remove interactive elements from clone
    clone.querySelectorAll('button').forEach((btn) => btn.remove());
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());
    clone.querySelectorAll('[role="tablist"]').forEach((el) => el.remove());
    clone.querySelectorAll('[role="tab"]').forEach((el) => el.remove());
    
    // Replace inputs with their values
    clone.querySelectorAll('input, select, textarea').forEach((el) => {
      const span = document.createElement('span');
      span.textContent = (el as HTMLInputElement).value || '';
      el.replaceWith(span);
    });

    // Style the clone for print
    clone.style.cssText = `
      background: white;
      width: 100%;
      box-shadow: none;
      border: none;
      border-radius: 0;
      font-size: 10pt;
    `;

    // Remove max-height and overflow restrictions
    clone.querySelectorAll('[style*="max-height"]').forEach((el) => {
      (el as HTMLElement).style.maxHeight = 'none';
    });
    clone.querySelectorAll('[class*="ScrollArea"]').forEach((el) => {
      (el as HTMLElement).style.maxHeight = 'none';
      (el as HTMLElement).style.overflow = 'visible';
    });
    clone.querySelectorAll('[data-radix-scroll-area-viewport]').forEach((el) => {
      (el as HTMLElement).style.maxHeight = 'none';
      (el as HTMLElement).style.overflow = 'visible';
    });

    printContainer.appendChild(clone);
  }

  // Hide all page content
  const allElements = document.body.children;
  const hiddenElements: HTMLElement[] = [];

  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i] as HTMLElement;
    if (el.id !== 'print-container') {
      hiddenElements.push(el);
      el.style.display = 'none';
    }
  }

  // Add print container to body
  document.body.appendChild(printContainer);

  // Set document title
  const originalTitle = document.title;
  const titlePrefix = documentTitle.replace(/\s+/g, '_');
  const titleSuffix = documentNumber ? `_${documentNumber}` : '';
  document.title = `${titlePrefix}${titleSuffix}`;

  // Print
  window.print();

  // Restore after print
  setTimeout(() => {
    printContainer.remove();
    hiddenElements.forEach((el) => {
      el.style.display = '';
    });
    document.title = originalTitle;
  }, 500);
}
