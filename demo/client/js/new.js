class Whiteboard {
    // ... 现有的属性和方法 ...
  
    constructor(canvas, socket, color = '#4d4d4d', thickness = 4) {
      // ... 现有的构造函数代码 ...
  
      this.isDrawingRectangle = false;
      this.isDrawingCircle = false;
      this.startX = 0;
      this.startY = 0;
      
      canvas.addEventListener('mousedown', (e) => {
        if (this.isDrawingRectangle || this.isDrawingCircle) {
          this.startX = e.clientX - this.canvas.getBoundingClientRect().left;
          this.startY = e.clientY - this.canvas.getBoundingClientRect().top;
        } else {
          // ... 其他绘画逻辑 ...
        }
      });
  
      canvas.addEventListener('mouseup', (e) => {
        if (this.isDrawingRectangle) {
          this.drawRectangle(this.startX, this.startY, e.clientX - this.canvas.getBoundingClientRect().left, e.clientY - this.canvas.getBoundingClientRect().top);
        } else if (this.isDrawingCircle) {
          this.drawCircle(this.startX, this.startY, e.clientX - this.canvas.getBoundingClientRect().left, e.clientY - this.canvas.getBoundingClientRect().top);
        }
        this.startX = 0;
        this.startY = 0;
      });
  
      // ... 其他事件监听 ...
    }
  
    // 绘制矩形的方法
    drawRectangle(startX, startY, endX, endY) {
      const width = endX - startX;
      const height = endY - startY;
      this.ctx.beginPath();
      this.ctx.rect(startX, startY, width, height);
      this.ctx.fillStyle = 'transparent';
      this.ctx.fill();
      this.ctx.lineWidth = this.thickness;
      this.ctx.strokeStyle = this.color;
      this.ctx.stroke();
    }
  
    // 绘制圆形的方法
    drawCircle(startX, startY, endX, endY) {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      this.ctx.beginPath();
      this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = 'transparent';
      this.ctx.fill();
      this.ctx.lineWidth = this.thickness;
      this.ctx.strokeStyle = this.color;
      this.ctx.stroke();
    }
  
    // ... 其他方法 ...
  }
  