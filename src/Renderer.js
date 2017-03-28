class Renderer {
    constructor(glContext, viewportWidth, viewportHeight) {
        this.gl = glContext;

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.geometry = null;
        this.program = null;

        this.attributesLocations = {};

        this.init();
    }

    init() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    }

    setGeometry(geometry) {
        this.geometry = geometry;

        if (this.program) {
            this.initAttributes();
        }
    }

    setProgram(program) {
        this.program = program;

        if (this.geometry) {
            this.initAttributes();
        }
    }

    initAttributes() {
        for (name in this.geometry.attributes) {
            this.attributesLocations[name] = this.gl.getAttribLocation(this.program.glProgram, name);

            if (this.attributesLocations[name] === -1) {
                delete this.attributesLocations[name];
                console.log('Cannot find attribute location: ${name}');
            }

            this.gl.enableVertexAttribArray(this.attributesLocations[name]);
        }
    }

    setViewport(viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    render() {
        if (!this.geometry) {
            console.log('Cannot render: no geometry specified');
        }

        if (!this.program) {
            console.log('Cannot render: no program specified');
        }

        if (!this.program.glProgram) {
            console.log('Cannot render: invalid program');
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program.glProgram);

        this.program.updateUniforms();

        for (let name in this.geometry.attributes) {
            let attribute = this.geometry.attributes[name];
            
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
            this.gl.vertexAttribPointer(this.attributesLocations[name], attribute.itemSize, this.gl.FLOAT, false, 0, 0);
        }

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.geometry.itemsCount);
    }
}

export default Renderer;