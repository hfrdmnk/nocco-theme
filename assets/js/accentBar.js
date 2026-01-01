/**
 * Accent Bar Behavior
 * - Makes the orange accent bar sticky when scrolling
 * - Highlights section headings (h2) when they align with the bar position
 */

export default function initAccentBar() {
  const bar = document.querySelector('.accent-bar');
  if (!bar) return;

  // Make the bar sticky
  bar.classList.add('sticky');
  bar.style.top = '2rem';

  // Find all h2 headings in the main content (not in posts with prose styling)
  const article = document.querySelector('article');
  if (!article) return;

  // Only apply highlighting on pages (not posts)
  // Posts use prose styling and don't need this feature
  if (document.body.classList.contains('post-template')) return;

  const headings = article.querySelectorAll('h2');
  if (!headings.length) return;

  // Track the currently highlighted heading
  let currentHighlight = null;

  // Create an IntersectionObserver to detect when headings are near the top
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Remove highlight from previous heading
          if (currentHighlight && currentHighlight !== entry.target) {
            currentHighlight.classList.remove('text-accent-500');
          }
          // Add highlight to current heading
          entry.target.classList.add('text-accent-500');
          currentHighlight = entry.target;
        }
      });
    },
    {
      // Trigger when heading is in the top portion of the viewport
      // This creates a "zone" where the accent bar would align with headings
      rootMargin: '-4rem 0px -85% 0px',
      threshold: 0
    }
  );

  // Observe all headings
  headings.forEach((heading) => {
    // Add transition for smooth color change
    heading.classList.add('transition-colors', 'duration-300');
    observer.observe(heading);
  });

  // Clean up when navigating away (for SPAs)
  return () => {
    observer.disconnect();
  };
}
