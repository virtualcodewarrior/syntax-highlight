import BrushBase from '../brush-base/brush-base.js';

function Brush() {
  this.regexList = [];
};

Brush.prototype = new BrushBase();
Brush.aliases = ['text', 'plain'];
export default Brush;
