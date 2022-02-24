import { logger } from "./logger";
import { notImplement, notImplementError } from "./notImplement";
import { mustString } from "./typechecker";

export async function getFileText(): Promise<string> {
    // return new Promise<string>((resolve, reject) => {
    //     const inputEle = document.createElement("input");
    //     inputEle.type = "file";
    //     inputEle.addEventListener("change", () => {
    //         const files = inputEle.files;
    //         if (files && files[0]) {
    //             const reader = new FileReader();
    //             reader.addEventListener("load", () => {
    //                 const text = reader.result;
    //                 if (typeof text === "string") {
    //                     logger.log("getFileText", text)
    //                     resolve(text);
    //                 }
    //             });
    //             reader.readAsText(files[0])
    //             return;
    //         }
    //         logger.error("getFileText", files)
    //         reject();
    //     });
    //     inputEle.click();
    // });

    const data = await window.myAPI.loadDataLocal();
    return mustString(data);

}
export async function downloadTextFile(text: string, title: string): Promise<void> {
    // const aEle = document.createElement("a");
    // aEle.href = window.URL.createObjectURL(new Blob([text], { "type": "text/plain" }));
    // aEle.download = title;
    // aEle.click();
    // aEle.remove();
    // logger.log("downloadTextFile", text, title)
    // return;
    console.log("downloadTextFile")
    const result = await window.myAPI.saveDataLocal({
        name: title,
        data: text,
    });
    if (!result) throw notImplementError();
    logger.log("saved", result);
    return;
}

