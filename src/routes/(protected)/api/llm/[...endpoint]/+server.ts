import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
    const data = await request.json();
    const path = params.endpoint;

    try {
        switch (path) {
            case 'chat': {
                const result = 9
                return json(result);
            }

            default:
                console.error(path, ' is an invalid path');
                return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return json({ success: false, message: 'Server Error' }, { status: 500 });
    }
};
