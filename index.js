const path = require("path");
const fs = require("fs");
const glob = require('glob');

export default class RouterPlugin{
    constructor(config = {}){
        this.path = config.basepath;
        this.output = config.output;
        this.filePath = config.filePath || '**/index.js';
        this.template = config.template || function(){return null};
        this.ignored = config.ignored || /\/(img|component).*/;
    }

    getDirs(){
        const files = glob.sync(path.resolve(this.path, this.filePath));
        const routers = [];
        files.forEach((file)=>{
            const dir = path.dirname(file);
            if(dir.length <= this.path.length){
                return;
            }
            let route = dir.replace(this.path, '');
            route = route.replace(this.ignored, '');
            routers.push(route);
        })
        return Array.from(new Set(routers));
    }

    getTemplate(){
        let template = `import Bundle from "Components/bundle";`;
        const arr = [];
        
        const pathDirs = this.path.split('/');

        this.getDirs().forEach((dir)=>{
            arr.push(`
                {
                    path: '${dir}',
                    exact: true,
                    component(props) {
                        return <Bundle {...props} load={() => import('./${pathDirs[pathDirs.length - 1]}${dir}')} />;
                    }
                }
            `)
        });

        return `${template} export default [${arr.join(',')}];`
    }

    apply(compiler) {
        compiler.plugin("make",  (compilation, callback) => {
            const template = this.template(this.getDirs()) || this.getTemplate();
            fs.writeFileSync(this.output, template);
            callback();
        });
    }
}