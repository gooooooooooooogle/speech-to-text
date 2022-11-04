<script>
  import Button from "./components/Button.svelte";

  let start = "开始";
  let audioPath = "";
  let resultPath = "";

  getUserName();
  async function getUserName() {
    // @ts-ignore
    let userName = await electronAPI.getUserName();
    resultPath = "C:\\Users\\" + userName + "\\Desktop";
  }

  async function selectAudioFileHander() {
    // @ts-ignore
    let filePath = await electronAPI.selectAudioFile();
    if (filePath != undefined) {
      audioPath = filePath;
      start = "开始";
    }
  }

  async function selectTextPath() {
    // @ts-ignore
    let filePath = await electronAPI.selectTextPath();
    if (filePath != undefined) {
      resultPath = filePath;
    }
  }

  async function openResultPath() {
    // @ts-ignore
    await electronAPI.openResultPath(resultPath);
  }

  async function startChange() {
    if (audioPath === "") {
      new Notification("消息", {
        body: "请先选择音频文件",
      });
      return;
    }
    start = "请稍等，转换中……";
    // @ts-ignore
    let result = await electronAPI.startChange({
      audioDatasourcePath: audioPath,
      textPath: resultPath,
    });
    console.log("最终结果：" + result);
    if (result == "success") {
      new Notification("消息", {
        body: "转换成功！",
      });
    } else {
      new Notification("消息", {
        body: "转换失败！",
      });
    }
    start = "开始";
  }
</script>

<div class=" h-screen bg-pink-300 bg-opacity-70 ">
  <!-- 页头 -->
  <div
    class="bg-blue-300 h-12 flex justify-center items-center text-3xl text-green-200"
  >
    <label for="">你的专属</label>
  </div>
  <!-- 页身 -->
  <div class="grid grid-cols-12 gap-2 my-24">
    <!-- 第一行 -->
    <div class="col-start-2 col-span-2 text-right">
      <label for="audio" class=" text-xl text-right">音频文件</label>
    </div>
    <div class="col-span-5">
      <input
        id="audio"
        type="text"
        bind:value={audioPath}
        placeholder="请选择音频文件..."
        class=" w-full border-none outline-none rounded-md px-2 h-8"
      />
    </div>
    <div class="col-span-3">
      <Button on:click={selectAudioFileHander} name="选择" width="14" />
    </div>

    <!-- 第二行 -->
    <div class="col-start-2 col-span-2 text-right">
      <label for="text" class=" text-xl text-right">保存路径</label>
    </div>
    <div class="col-span-5">
      <input
        id="text"
        type="text"
        bind:value={resultPath}
        class="w-full border-none outline-none rounded-md px-2 h-8"
      />
    </div>
    <div class="col-span-3">
      <Button name="选择" width="14" on:click={selectTextPath} />
      <Button name="打开目录" width="18" on:click={openResultPath} />
    </div>

    <!-- 第三行 -->
    <div class="col-start-4 col-end-9 my-4">
      <Button name={start} width="full" on:click={startChange} />
    </div>
  </div>
</div>
