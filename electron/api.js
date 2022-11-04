const { dialog, shell } = require('electron')
const { start } = require('./audio_change_flow')
const { exec } = require('child_process')
const fs = require('fs')
const os = require('os')

exports.getUserName = () => {
  return os.userInfo().username;
}

exports.selectAudioFile = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

exports.selectTextPath = async () => {
  let options = {
    title: "请选择下载路径",
    properties: ["openDirectory", "showHiddenFiles"],
  };
  const { canceled, filePaths } = await dialog.showOpenDialog(options)
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

exports.openResultPath = (event, resultPath) => {
  let path = resultPath[0];

  // if (path.endsWith('Desktop')) {
  //   // Electron 有Bug 打开包含中文路径报错
  //   // let newPath = iconv.encode(path, 'gbk').toString('binary');
  //   shell.openExternal(path);
  // } else {
  //   let cmd = 'explorer.exe ' + path + '\\';
  //   exec(cmd)
  // }

  let cmd = 'explorer.exe ' + path + '\\';
  exec(cmd)
}

exports.audioChange = async (event, params) => {
  let audioPath = params[0].audioDatasourcePath;
  let textPath = params[0].textPath;
  // 创建文件夹
  let result = await makeDir();
  if (result != 'success') return 'error';
  if (result == 'success') {
    result = await start(audioPath, textPath);
    return result;
  }
}

function makeDir() {
  return new Promise((resolve, reject) => {

    remove('D:\\resource');

    fs.mkdir('D:\\resource\\audioCuts', { recursive: true }, (err1) => {
      if (err1) reject(err1);
      fs.mkdir('D:\\resource\\audioMP3', { recursive: true }, (err2) => {
        if (err2) reject(err1);
        resolve('success');
      });
    });

  })

  function remove(file) {
    //1.判断参数是文件还是文件夹
    let stats = fs.statSync(file)
    if (stats.isFile()) {
      //2.删除文件函数
      fs.unlinkSync(file)
    } else {
      //3.文件夹(该文件夹下面是否还有子文件/目录)
      let files = fs.readdirSync(file)
      //4.遍历文件夹下的文件内容
      for (let a = 0; a < files.length; a++) {
        let f = files[a];//s只是文件名，不包含完整路径
        let f_stats = fs.statSync(file + '/' + f);//查看每个文件的属性
        if (f_stats.isFile()) {
          fs.unlinkSync(file + '/' + f)
        } else {
          remove(file + '/' + f)
        }
      }
      //5.最后删除空文件夹
      fs.rmdirSync(file)
    }
  }
}
