((io, Whiteboard) => {
    const printDemoMessage = () => {
        console.log(
            '%c👋 Hello there!',
            'font-weight: bold; font-size: 2rem;',
        );

        console.log(
            'Make the line %cgreen',
            'color: #00ff00;',
        );

        console.log(
            '%cwhiteboard.color = \'#00ff00\';',
            'color: #f3900c;',
        );

        console.log(
            'Make the line %cthicker',
            'font-weight: bold;',
        );

        console.log(
            '%cwhiteboard.increaseThickness(20);',
            'color: #f3900c;',
        );

        console.log(
            '🎉 Or you can %cdownload the image!',
            'font-weight: bold;',
        );

        console.log(
            '%cwhiteboard.download();',
            'color: #f3900c;',
        );
    };

    window.addEventListener('load', () => {
        console.log('🌍 Connecting to server…');

        const socket = io();
        const canvas = document.querySelector('#myCanvas');

        socket.on('connect', () => {
            // At this point we have connected to the server
            console.log('🌍 Connected to server');

            // Create a Whiteboard instance
            const whiteboard = new Whiteboard(canvas, socket);

            // Expose the whiteboard instance
            window.whiteboard = whiteboard;

            printDemoMessage();
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        // 获取元素
        const pencilButton = document.getElementById('btnPencil');
        const rectangleButton = document.getElementById('btnRectangle');
        const circleButton = document.getElementById('btnCircle');
        const clearButton = document.getElementById('btnClear');
        const thicknessButton = document.getElementById('btnThickness');
        const thicknessOptions = document.getElementById('thicknessOptions');
        const colorPicker = document.getElementById('colorPicker');
        
        // 画笔工具
        pencilButton.addEventListener('click', () => {
            // 在这里设置画笔模式
            console.log("Pencil tool selected");
            whiteboard.setPencil();
        });
    
        // 矩形工具
        rectangleButton.addEventListener('click', () => {
            // 在这里设置矩形模式
            console.log("Rectangle tool selected");
            whiteboard.setRectangle();
        });
    
        // 圆形工具
        circleButton.addEventListener('click', () => {
            // 在这里设置圆形模式
            console.log("Circle tool selected");
            whiteboard.setCircu();
        });

        clearButton.addEventListener('click', () => {
            console.log("Clear button clicked");
            whiteboard._emitClear();
        });

        
    
        // 线条粗细控制
        thicknessButton.addEventListener('click', () => {
            // 显示或隐藏线条粗细选项
            thicknessOptions.style.display = thicknessOptions.style.display === 'none' ? 'block' : 'none';
        });
    
        // 颜色选择
        colorPicker.addEventListener('input', (event) => {
            // 设置画笔颜色
            const color = event.target.value;
            console.log("Color selected: ", color);
            // 示例: whiteboard.setColor(color);
        });


        const btnIncreaseThickness = document.getElementById('increaseThickness');
        const btnDecreaseThickness = document.getElementById('decreaseThickness');
        const currentThickness = document.getElementById('currentThickness');
        // 增加按钮点击事件
        btnIncreaseThickness.addEventListener('click', () => {
            whiteboard.increaseThickness(1); 
            ctx = currentThickness.textContent;
            const match = ctx.match(/\d+/);
            number = match ? parseInt(match[0]) : 4;
            number = number +1;
            if(number > 20){
                number = 20;
            }
            currentThickness.textContent = 'Thickness: ' + number + 'px';
            

        });

        // 减少按钮点击事件
        btnDecreaseThickness.addEventListener('click', () => {
            whiteboard.decreaseThickness(1); 
            ctx = currentThickness.textContent;
            const match = ctx.match(/\d+/);
            number = match ? parseInt(match[0]) : 4;
            number = number - 1;
            if(number < 0){
                number = 0;
            }
            currentThickness.textContent = 'Thickness: ' + number + 'px';
        });
        // choose color
        document.getElementById('colorPicker').addEventListener('change', function() {
            var chosenColor = this.value;
            console.log(chosenColor);
            whiteboard.setColor(chosenColor);
        });
    });
    
    
})(io, Whiteboard);

