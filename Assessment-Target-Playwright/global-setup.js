const fs = require('fs')
const path = require('path')

module.exports=async()=>{
    const allureResultsDir = path.join('allure-results');
    
    if (fs.existsSync(allureResultsDir)) {
        fs.rmSync(allureResultsDir, { recursive: true, force: true });
    }
    
}