/**
 * Simple hash-based router for single-page navigation.
 */
export type Route = {
  path: string;
  title: string;
  render: (container: HTMLElement) => { stop?: () => void } | void;
};

export class Router {
  private readonly routes: Map<string, Route> = new Map();
  private currentCleanup?: () => void;
  private readonly container: HTMLElement;
  private navElement?: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    window.addEventListener('hashchange', () => this.handleRouteChange());
  }

  /**
   * Registers a route.
   */
  addRoute(route: Route): this {
    this.routes.set(route.path, route);
    return this;
  }

  /**
   * Starts the router and renders the initial route.
   */
  start(): void {
    this.renderNav();
    this.handleRouteChange();
  }

  /**
   * Gets the current route path from the URL hash.
   */
  private getCurrentPath(): string {
    const hash = window.location.hash.slice(1);
    return hash || '/';
  }

  /**
   * Handles route changes.
   */
  private handleRouteChange(): void {
    const path = this.getCurrentPath();
    const route = this.routes.get(path) || this.routes.get('/');

    if (!route) {
      console.error(`Route not found: ${path}`);
      return;
    }

    // Cleanup previous view
    if (this.currentCleanup) {
      this.currentCleanup();
      this.currentCleanup = undefined;
    }

    // Clear the content container
    const content = this.container.querySelector('.router-content') as HTMLElement;
    if (content) {
      content.innerHTML = '';
      const result = route.render(content);
      if (result?.stop) {
        this.currentCleanup = result.stop;
      }
    }

    // Update nav active state
    this.updateNavActiveState(path);
  }

  /**
   * Renders the navigation bar.
   */
  private renderNav(): void {
    this.navElement = document.createElement('nav');
    this.navElement.className = 'router-nav';

    this.routes.forEach((route) => {
      const link = document.createElement('a');
      link.href = `#${route.path}`;
      link.textContent = route.title;
      link.className = 'nav-link';
      this.navElement!.appendChild(link);
    });

    const content = document.createElement('div');
    content.className = 'router-content';

    this.container.innerHTML = '';
    this.container.appendChild(this.navElement);
    this.container.appendChild(content);
  }

  /**
   * Updates the active state of navigation links.
   */
  private updateNavActiveState(currentPath: string): void {
    if (!this.navElement) return;

    this.navElement.querySelectorAll('.nav-link').forEach((link) => {
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (href === `#${currentPath}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

