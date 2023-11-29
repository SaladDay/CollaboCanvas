class Whiteboard {
  /**
   * Constructor
   *
   * @param {HTMLElement} canvas          The canvas element
   * @param {socket} socket               The socket.io socket
   * @param {string} [color='#4d4d4d']    The default color
   * @param {number} [thickness=4]        The default thickness
   */
  constructor(canvas, socket, color = '#a93232', thickness = 4) {
    // Define read-only properties
    Object.defineProperties(this, {
      thicknessMin: { value: 1 },
      thicknessMax: { value: 120 },
      socketEvents: {
        value: {
          DRAW: 'DRAW',
          DRAW_BEGIN_PATH: 'DRAW_BEGIN_PATH',
          DRAW_RECTANGLE: 'DRAW_RECTANGLE',
          DRAW_CIRCU:'DRAW_CIRCU',
          CLEAR:'CLEAR'
        },
      },
    });

    this.canvas = canvas;
    this.socket = socket;
    this.color = color;
    this.thickness = thickness;

    this.isDrawingRectangle = false;
    this.isDrawingCircle = false;
    this.startX = 0;
    this.startY = 0;
    
    this.ctx = this.canvas.getContext('2d');

    //start drawing when the mouse is down
    canvas.addEventListener('mousedown', (e) => {
      if (this.isDrawingRectangle || this.isDrawingCircle) {
        this.startX = e.clientX - this.canvas.getBoundingClientRect().left;
        this.startY = e.clientY - this.canvas.getBoundingClientRect().top;
      }
      this.socket.emit(this.socketEvents.DRAW_BEGIN_PATH);
    });

    canvas.addEventListener("mouseup",(e) => {
      if (this.isDrawingRectangle) {
        this._emitDrawingRectange(e);
      }else if(this.isDrawingCircle){
        this._emitDrawingCircle(e);
      }
    });

    canvas.addEventListener('mousemove', (e) => {

      // Check whether we're holding the left click down while moving the mouse
      if (e.buttons === 1 && !this.isDrawingCircle && !this.isDrawingRectangle) {
        this._emitDrawingData(e);
      }
    });

    // canvas.addEventListener('click', (e) => {
    //   if(!this.isDrawingCircle){
    //     this._emitDrawingData(e);
    //   }
    // });

    //clean the canvas when the board was constructes
    this._resizeCanvas();

    const self = this;
    window.addEventListener('resize', () => self._resizeCanvas());
    
    //receive the data from the server
    this.socket.on(this.socketEvents.DRAW, (data) => self._socketDraw(data));
    this.socket.on(this.socketEvents.DRAW_RECTANGLE, (data)=> self._socketDrawRectangle(data));
    this.socket.on(this.socketEvents.DRAW_CIRCU,(data)=>self._socketDrawCircle(data));
    this.socket.on(this.socketEvents.CLEAR ,(data)=>self.clear());
  }

  /**
   * Resize the canvas, so its width and height
   * attributes are the same as the offsetWidth
   * and offsetHeight
   *
   * The .width and .height defaults to 300px and
   * 150px and we have to change them to match the
   * .offsetWidth and .offsetHeight, which are the
   * layout width and heights of our scaled canvas
   * (the ones we have set in our CSS file)
   */
  _resizeCanvas() {
    const { canvas, ctx } = this;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear the canvas for the browser that don't fully clear it
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /**
   * Get the mouse input and draw on our canvas
   *
   * @param {MouseEvent} e    The mousemove event
   * @private
   */
  _emitDrawingData(e) {
    const {
      canvas,
      color,
      thickness,
      socket,
      socketEvents,
    } = this;
    // get the canvas size
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Emit drawing data to other people
    socket.emit(socketEvents.DRAW, {
      x,
      y,
      color,
      thickness,
    });
  }

  _emitDrawingRectange(e){
    const{
      canvas,
      color,
      thickness,
      socket,
      socketEvents,
      startX,
      startY
    } = this;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    socket.emit(socketEvents.DRAW_RECTANGLE,{
      startX,
      startY,
      endX,
      endY,
      color,
      thickness
    });
  
  }
  _emitDrawingCircle(e){
    const{
      canvas,
      color,
      thickness,
      socket,
      socketEvents,
      startX,
      startY
    } = this;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    socket.emit(socketEvents.DRAW_CIRCU,{
      startX,
      startY,
      endX,
      endY,
      color,
      thickness
    });
  }

  /**
   * Get the drawing data from the socket and basically
   * draw on our canvas whatever the other person draws
   *
   * @param {Object} data     The drawing data
   * @private
   */
  _socketDraw(data) {
    const {
      prev,
      curr,
      color,
      thickness,
    } = data;

    const { ctx } = this;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(curr.x, curr.y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  _socketDrawRectangle(data){
    const{
      startX,
      startY,
      endX,
      endY,
      color,
      thickness
    } = data;

    const { ctx } = this;

    const width = endX - startX;
    const height = endY - startY;
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.fillStyle = 'transparent';
    ctx.fill();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();

  }
  _socketDrawCircle(data){
    const{
      startX,
      startY,
      endX,
      endY,
      color,
      thickness
    } = data;

    const { ctx } = this;

    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const radiusX = Math.abs(endX - startX) /2;
    const radiusY = Math.abs(endY - startY) /2;

    ctx.beginPath();
    ctx.ellipse(centerX,centerY,radiusX,radiusY,0,0,2*Math.PI);
    ctx.fillStyle = 'transparent';
    ctx.fill();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  /**
   * Save our canvas drawing as an image file.
   * Using this method allows us to have a custom
   * name for the file we will download
   *
   *
   * @param {string} filename     The name of the image file
   */
  download(filename) {
    const lnk = document.createElement('a');
    lnk.download = filename;
    lnk.href = this.canvas.toDataURL();

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, true, window,
        0, 0, 0, 0, 0, false,
        false, false, false, 0, null);

      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent('onclick');
    }
  }

  /**
   * Increase the thickness
   *
   * @param {number} step     The amount of the increase
   *                          (e.g. `.increaseThickness(1)`
   *                          will increase the thickness by 1 pixel)
   */
  increaseThickness(step) {
    this.thickness += step;
    console.log(this.thickness);
    if (this.thickness > this.thicknessMax) {
      this.thickness = this.thicknessMax;
    }
  }

  /**
   * Decrease the thickness
   *
   * @param {number} step     The amount of the decrease
   *                          (e.g. `.decreaseThickness(1)`
   *                          will decrease the thickness by 1 pixel)
   */
  decreaseThickness(step) {
    this.thickness -= step;
    console.log(this.thickness);
    if (this.thickness < this.thicknessMin) {
      this.thickness = this.thicknessMin;
    }
  }
  /**
   * Set the color
   * @param {string} color    The color
   */
  setColor(color) {
    this.color = color;
  };

  setRectangle(){
    this.isDrawingRectangle = true;
    this.isDrawingCircle = false;
  };

  setCircu(){
    this.isDrawingCircle = true;
    this.isDrawingRectangle = false;
  };
  setPencil(){
    this.isDrawingCircle = false;
    this.isDrawingRectangle = false;
  };
  
  _emitClear(){
    this.socket.emit(this.socketEvents.CLEAR);
  };

  /**
   * Clear the entire canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
