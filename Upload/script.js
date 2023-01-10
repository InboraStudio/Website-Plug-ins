window.addEventListener("DOMContentLoaded",() => {
	const component = new FileUpload(".upload");
});

class FileUpload {
    bubbles = [];
    isUploading = false;
    progress = 0;
    timeout = null;
    uploadClass = "upload--running";
    doneClass = "upload--done";

    constructor(el) {
        this.el = document.querySelector(el);
        this.el?.addEventListener("click",this.upload.bind(this));
        this.circle = this.el?.querySelector("[data-circle]");
        this.uploadButton = this.el?.querySelector("[data-upload]");
    }
    progressDim() {
        this.uploadButton.parentElement.setAttribute("aria-hidden", "true");
    }
    progressLoop() {
        // update the progress
        this.progress += 0.01;
        this.progressUpdateDisplay();

        // spawn a bubble
        const bubble = document.createElement("div");
        const duration = Utils.randomFloat(2,3);
        const brightneess = Utils.randomFloat(0.6,1);
        const rotate = Utils.randomFloat(-15,15);
        const size = Utils.randomFloat(1,2);

        bubble.classList.add("upload__bubble");
        bubble.style.setProperty("--dur", `${duration}s`);
        bubble.style.filter = `brightness(${brightneess})`;
        bubble.style.transform = `translateX(-50%) rotate(${rotate}deg)`;
        bubble.style.width = `${size}em`;
        bubble.style.height = `${size}em`;
        this.bubbles.push(bubble);
        this.circle?.appendChild(bubble);

        // loop until finished
        if (this.progress < 1) {
            this.timeout = setTimeout(this.progressLoop.bind(this), 50);
        } else {
            this.timeout = setTimeout(this.progressDim.bind(this), 500);
            this.el.classList.add(this.doneClass);
        }
    }
    progressUpdateDisplay(clear) {
        const progress = this.el.querySelector("[data-progress]");

        if (this.circle && !clear) {
            const startSize = 13;
            const enlargeBy = 10;
            const size = startSize + enlargeBy * this.progress;

            this.circle.style.width = `${size}em`;
            this.circle.style.height = `${size}em`;
        }
        if (progress) {
            progress.innerText = clear === true ? "" :`${Math.floor(this.progress * 100)}%`;
        }
    }
    reset() {
        if (this.isUploading) {
            while (this.circle.firstChild) {
                this.circle.removeChild(this.circle.lastChild);
            }
            this.circle.removeAttribute("style");

            this.bubbles = [];
            this.el.classList.remove(this.uploadClass);
            this.el.classList.remove(this.doneClass);
            this.isUploading = false;
            this.progress = 0;
            this.progressUpdateDisplay(true);
            this.uploadButton.parentElement.setAttribute("aria-hidden", "false");
            this.uploadButton.disabled = false;
            this.uploadButton.textContent = "Upload";
        }
    }
    upload(e) {
        const { target } = e;

        if (!this.isUploading && target.hasAttribute("data-upload")) {
            this.isUploading = true;
            this.el.classList.add(this.uploadClass);

            target.disabled = true;
            target.textContent = "Uploading…";

            this.progressUpdateDisplay();
            this.timeout = setTimeout(() => {
	            if (this.circle) this.circle.style.transitionTimingFunction = "linear";

                this.progressLoop();
            }, 500);
        } else if (target.hasAttribute("data-reset")) {
            this.reset();
        }
    }
}

class Utils {
	static randomFloat(min = 0,max = 2**32) {
        const percent = crypto.getRandomValues(new Uint32Array(1))[0] / 2**32;
        const relativeValue = (max - min) * percent;

        return min + relativeValue;
    }
}