/****************************************************************************
 * Copyright 2018 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

/* eslint-disable no-shadow */

import mainmenu from './mainmenu';
import tools from './tools';
import atoms from './atoms';
import zoom from './zoom';
import server from './server';
import debug from './debug';
import templates from './templates';

// Combine the resolved shortcuts and export them
export default {
	...mainmenu,
	...server,
	...debug,
	...tools,
	...atoms,
	...zoom,
	...templates
};
