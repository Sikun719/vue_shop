import {
	request
} from "./core";

import {
	METHOD,
	PATH
} from "./config";

const netClient = {
	//首页数据
	getHome(params) {
		return request(METHOD.GET, PATH.getHome, params)
	}
}

export default netClient;
