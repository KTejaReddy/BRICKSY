export default (req: any, res: any) => {
  res.status(200).json({ pong: true, time: Date.now() });
};
