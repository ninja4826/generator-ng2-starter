import { Base } from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';

export default class Ng2Generator extends Base {
  prompting() {
    this.log(yosay(`Welcome to the ${chalk.red('ng2-starter')} generator!`));
    
    let prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];
    return this.prompt(prompts).then((props) => {
      this.props = props;
    });
  }
  
  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }
  
  install() {
    this.installDependencies();
  }
}