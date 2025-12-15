import './style.css';
import { configurePlatform } from '@holiday-lights/imager-core';
import { BrowserImageLoader, BrowserTextRenderer } from '@holiday-lights/imager-core/browser';
import { MultiMatrixEmulator } from './multi-matrix-emulator';
import { MultiImageService } from './multi-image.service';

// Configure platform-specific implementations
configurePlatform({
  imageLoader: new BrowserImageLoader('/assets'),
  textRenderer: new BrowserTextRenderer(),
});

const app = document.querySelector<HTMLDivElement>('#app')!;

const multiImageService = new MultiImageService();
const allScenes = multiImageService.getAllScenes();

// Create main layout container
const mainLayout = document.createElement('div');
mainLayout.className = 'main-layout';

// Create emulator container (left side)
const emulatorContainer = document.createElement('div');
emulatorContainer.className = 'emulator-container';
mainLayout.appendChild(emulatorContainer);

// Create controls container (right side)
const controlsContainer = document.createElement('div');
controlsContainer.className = 'scene-controls';

// Create collapsible header
const controlsHeader = document.createElement('div');
controlsHeader.className = 'controls-header';

const controlsTitle = document.createElement('div');
controlsTitle.className = 'controls-title';
controlsTitle.textContent = 'Select Scenes';

const toggleButton = document.createElement('button');
toggleButton.className = 'toggle-button';
toggleButton.textContent = '▼';
toggleButton.setAttribute('aria-label', 'Toggle scene selection');

controlsHeader.appendChild(controlsTitle);
controlsHeader.appendChild(toggleButton);

// Create collapsible content
const controlsContent = document.createElement('div');
controlsContent.className = 'controls-content';

const sceneCheckboxes = document.createElement('div');
sceneCheckboxes.className = 'scene-checkboxes';

// Initialize with only "Default" scene selected
const selectedScenes = new Set<string>();
const defaultScene = allScenes.find(s => s.name === 'Default');
if (defaultScene) {
  selectedScenes.add(defaultScene.id);
}

allScenes.forEach(scene => {
  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'scene-checkbox-label';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = scene.id;
  checkbox.checked = scene.name === 'Default';
  checkbox.className = 'scene-checkbox';

  const labelText = document.createElement('span');
  labelText.textContent = scene.name;

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(labelText);
  sceneCheckboxes.appendChild(checkboxLabel);

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      selectedScenes.add(scene.id);
    } else {
      selectedScenes.delete(scene.id);
    }
    updateEmulator();
  });
});

controlsContent.appendChild(sceneCheckboxes);

// Toggle collapse/expand functionality
let isCollapsed = false;
toggleButton.addEventListener('click', () => {
  isCollapsed = !isCollapsed;
  controlsContent.classList.toggle('collapsed', isCollapsed);
  toggleButton.textContent = isCollapsed ? '▶' : '▼';
});

controlsContainer.appendChild(controlsHeader);
controlsContainer.appendChild(controlsContent);
mainLayout.appendChild(controlsContainer);

app.appendChild(mainLayout);

let emulator: MultiMatrixEmulator;

const updateEmulator = () => {
  // Stop current emulator if running
  if (emulator) {
    emulator.stop();
  }

  // Get selected imagers
  const selectedIds = Array.from(selectedScenes);
  const imagers = multiImageService.getImagers(selectedIds.length > 0 ? selectedIds : []);

  if (imagers.length === 0) {
    emulatorContainer.innerHTML = '<div class="no-scenes">Please select at least one scene</div>';
    return;
  }

  // Create new emulator with selected scenes (always cycling)
  emulator = new MultiMatrixEmulator(
    emulatorContainer,
    imagers,
    100,
    true
  );
  emulator.start();
};


// Initialize emulator
updateEmulator();


