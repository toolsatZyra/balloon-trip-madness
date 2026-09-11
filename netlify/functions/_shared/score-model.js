import { Flight } from '../../../src/flight.js';
export const MODES = ['trip'];
export function resizeModel(model, width) { const ratio=width/model.width; model.width=width; model.player.x=Math.min(width-26,model.player.x*ratio); }
export function createModel(replay) { return new Flight(replay.seed,replay.width); }
export const WIDTH_RANGE=[420,5000];
