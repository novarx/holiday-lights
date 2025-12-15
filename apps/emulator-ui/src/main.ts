import './style.css';
import { Emulator } from './emulator';

const app = document.querySelector<HTMLDivElement>('#app')!;
const emulator = new Emulator(app);
emulator.start();

