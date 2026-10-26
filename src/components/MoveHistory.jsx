import './MoveHistory.css';

const MoveHistory = ({ moves }) => {
  // Grouper les coups par paire (blanc, noir)
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <div className="move-history">
      <h3 className="history-title">Historique des coups</h3>
      <div className="history-list">
        {movePairs.length === 0 ? (
          <div className="no-moves">Aucun coup joué</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Blancs</th>
                <th>Noirs</th>
              </tr>
            </thead>
            <tbody>
              {movePairs.map((pair) => (
                <tr key={pair.number}>
                  <td className="move-number">{pair.number}.</td>
                  <td className="move-notation white-move">
                    {pair.white?.notation || '-'}
                  </td>
                  <td className="move-notation black-move">
                    {pair.black?.notation || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
