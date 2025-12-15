import './style.css';
import { configurePlatform } from '@holiday-lights/imager-core';
import { BrowserImageLoader, BrowserTextRenderer } from '@holiday-lights/imager-core/browser';
import { MultiMatrixEmulator } from './multi-matrix-emulator';
import { MultiImageService } from './multi-image.service';
import { Router } from './router';

// Configure platform-specific implementations
configurePlatform({
  imageLoader: new BrowserImageLoader('/assets'),
  textRenderer: new BrowserTextRenderer(),
});

const app = document.querySelector<HTMLDivElement>('#app')!;

const router = new Router(app);

router.addRoute({
  path: '/',
  title: 'Matrix Slideshow',
  render: (container) => {
    const multiImageService = new MultiImageService();
    const allScenes = multiImageService.getAllScenes();

    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'scene-controls';

    // Create cycling toggle
    const cyclingContainer = document.createElement('div');
    cyclingContainer.className = 'control-group';

    const cyclingLabel = document.createElement('label');
    cyclingLabel.className = 'control-label';

    const cyclingCheckbox = document.createElement('input');
    cyclingCheckbox.type = 'checkbox';
    cyclingCheckbox.id = 'cycling-toggle';
    cyclingCheckbox.checked = true;

    const cyclingText = document.createElement('span');
    cyclingText.textContent = 'Auto-cycle scenes';

    cyclingLabel.appendChild(cyclingCheckbox);
    cyclingLabel.appendChild(cyclingText);
    cyclingContainer.appendChild(cyclingLabel);

    // Create scene selection
    const sceneContainer = document.createElement('div');
    sceneContainer.className = 'control-group';

    const sceneLabel = document.createElement('div');
    sceneLabel.className = 'control-label';
    sceneLabel.textContent = 'Select scenes:';
    sceneContainer.appendChild(sceneLabel);

    const sceneCheckboxes = document.createElement('div');
    sceneCheckboxes.className = 'scene-checkboxes';

    const selectedScenes = new Set<string>(allScenes.map(s => s.id));

    allScenes.forEach(scene => {
      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'scene-checkbox-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = scene.id;
      checkbox.checked = true;
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

    sceneContainer.appendChild(sceneCheckboxes);

    controlsContainer.appendChild(cyclingContainer);
    controlsContainer.appendChild(sceneContainer);
    container.appendChild(controlsContainer);

    // Create emulator container
    const emulatorContainer = document.createElement('div');
    emulatorContainer.className = 'emulator-container';
    container.appendChild(emulatorContainer);

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

      // Create new emulator with selected scenes and cycling setting
      emulator = new MultiMatrixEmulator(
        emulatorContainer,
        imagers,
        100,
        cyclingCheckbox.checked
      );
      emulator.start();
    };

    cyclingCheckbox.addEventListener('change', () => {
      if (emulator) {
        emulator.setCycling(cyclingCheckbox.checked);
      }
    });

    // Initialize emulator
    updateEmulator();

    return {
      stop: () => {
        if (emulator) {
          emulator.stop();
        }
      }
    };
  }
});

router.start();

