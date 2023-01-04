window.addEventListener("DOMContentLoaded",() => {
	const grs = new GradientRangeSlider("#gradient-range");
});

class GradientRangeSlider {
	constructor(qs) {
		this.input = document.querySelector(qs);
		this.input?.addEventListener("input",this.update.bind(this));
		this.update();
	}
	update(e) {
		let value = this.input.defaultValue;

		// when manually set
		if (e) value = e.target?.value;
		// when initiated
		else this.input.value = value;

		const min = this.input.min || 0;
		const max = this.input.max || 100;
		const percentRaw = (value - min) / (max - min) * 100;
		const percent = +percentRaw.toFixed(2);
		const handle = 1.5 * (1 - (percent / 100)) - 1.125;
		const percentStyle = `calc(${percent}% + ${handle}em)`;

		this.input.parentElement?.style.setProperty("--percent",percentStyle);
	}
}