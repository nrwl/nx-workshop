import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header.component';

import '@angular/material/prebuilt-themes/purple-green.css';

export default {
  title: 'HeaderComponent',
  component: HeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [MatToolbarModule],
    })
  ],
} as Meta<HeaderComponent>;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    title:  '',
}