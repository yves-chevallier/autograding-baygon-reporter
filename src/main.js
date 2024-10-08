const core = require("@actions/core");
const { NotifyClassroom } = require("./notify-classroom");

async function run() {
    try {
        const webhookUrl = core.getInput('webhook_url');

        NotifyClassroom(10, 50);

        let status = "success";
        if (status === "failure") {
            core.setFailed("Some tests failed.");
        }
    } catch (error) {
        const input = core.getInput("runners");
        const pattern = /^([a-zA-Z0-9]+,)*[a-zA-Z0-9]+$/

        console.error(error.message);
        core.setFailed(error.message);
    }
}
