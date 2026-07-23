const canvas = document.querySelector("#canvas") as HTMLCanvasElement | null;
if (!canvas) throw new Error("[Error] Canvas not found");

const ctx = canvas.getContext("2d");
