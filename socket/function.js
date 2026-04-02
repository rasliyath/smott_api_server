import os from "os-utils";


function getCPUUsage () {
    return new Promise(resolve => { 
        os.cpuUsage(value => resolve(value))
    })
}
function getCPUFree () {
    return new Promise(resolve => { 
        os.cpuFree(value => resolve(value))
    })
}


const cpuUsage = await getCPUUsage()
let usage =(cpuUsage * 100).toFixed(1)+"%";
let obj = {
    "cpuUsage": usage,
    "cpuFree":  await getCPUFree(),
    "platform":os.platform(),
    "cpuCount":os.cpuCount(),
    "sysCount":os.sysUptime(),
    "totalMemory":os.totalmem(),
    "freeMemory":(os.freememPercentage()*100).toFixed(1)+"%",
    "usedMemory":(100-(os.freememPercentage()*100).toFixed(1))+"%",
    "loadAvg":os.loadavg(5)
  }

  export const currentCpuUsage = ()=>
  {
    return obj;
  }