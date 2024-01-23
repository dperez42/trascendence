export interface Game {
	game_id: number;
	game_status: number;
    game_count: number,
    game_type: number,
    game_vel: number,
    ballpos:number[],
    ballvel:number[],
    ballrad: number,
    p1nick: string,
    p1id: string,
    p1y: number,
    p1time: number,
    p1ptos:number,
    p1_state: boolean,
    p2nick: string,
    p2id: string,
    p2y: number,
    p2time: number,
    p2ptos:number,
    p2_state: boolean,
    pad:number[]   
}