"use client"

import { useState, useCallback } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Crown, AlertTriangle } from "lucide-react"

export default function ChessGame() {
  const [game, setGame] = useState(new Chess())
  const [gamePosition, setGamePosition] = useState(game.fen())
  const [moveFrom, setMoveFrom] = useState("")
  const [moveTo, setMoveTo] = useState("")
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})

  // Get current player
  const currentPlayer = game.turn() === "w" ? "White" : "Black"

  // Check game status
  const isInCheck = game.inCheck()
  const isCheckmate = game.isCheckmate()
  const isStalemate = game.isStalemate()
  const isDraw = game.isDraw()

  function makeAMove(move: any) {
    const gameCopy = new Chess(game.fen())
    const result = gameCopy.move(move)
    setGame(gameCopy)
    setGamePosition(gameCopy.fen())
    return result
  }

  function getMoveOptions(square: string) {
    const moves = game.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: any = {}
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      }
      return move
    })
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    }
    setOptionSquares(newSquares)
    return true
  }

  function onSquareClick(square: string) {
    setRightClickedSquares({})

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square)
      if (hasMoveOptions) setMoveFrom(square)
      return
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        square: moveFrom,
        verbose: true,
      })
      const foundMove = moves.find((m) => m.from === moveFrom && m.to === square)

      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square)
        setMoveFrom(hasMoveOptions ? square : "")
        return
      }

      // valid move
      setMoveTo(square)

      // if promotion move
      if (
        (foundMove.color === "w" && foundMove.piece === "p" && square[1] === "8") ||
        (foundMove.color === "b" && foundMove.piece === "p" && square[1] === "1")
      ) {
        setShowPromotionDialog(true)
        return
      }

      // is normal move
      const move = makeAMove({
        from: moveFrom,
        to: square,
        promotion: "q",
      })

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square)
        if (hasMoveOptions) setMoveFrom(square)
        return
      }

      setMoveFrom("")
      setMoveTo("")
      setOptionSquares({})
      return
    }
  }

  function onPromotionPieceSelect(piece?: string) {
    // if no piece passed then user has cancelled dialog
    if (piece) {
      const move = makeAMove({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      })
      if (move === null) {
        return false
      }
    }

    setMoveFrom("")
    setMoveTo("")
    setShowPromotionDialog(false)
    setOptionSquares({})
    return true
  }

  function onSquareRightClick(square: string) {
    const colour = "rgba(0, 0, 255, 0.4)"
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] && rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    })
  }

  const resetGame = useCallback(() => {
    const newGame = new Chess()
    setGame(newGame)
    setGamePosition(newGame.fen())
    setMoveFrom("")
    setMoveTo("")
    setShowPromotionDialog(false)
    setRightClickedSquares({})
    setMoveSquares({})
    setOptionSquares({})
  }, [])

  // Get game status message
  const getGameStatus = () => {
    if (isCheckmate) {
      return `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins!`
    }
    if (isStalemate) {
      return "Stalemate! Game is a draw."
    }
    if (isDraw) {
      return "Draw!"
    }
    if (isInCheck) {
      return `${currentPlayer} is in check!`
    }
    return `${currentPlayer}'s turn`
  }

  const getStatusColor = () => {
    if (isCheckmate) return "destructive"
    if (isStalemate || isDraw) return "secondary"
    if (isInCheck) return "destructive"
    return "default"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center justify-center gap-2">
            <Crown className="h-8 w-8" />
            Chess Game
          </h1>
          <p className="text-slate-600 dark:text-slate-400">2-Player Hotseat Mode</p>
        </div>

        <div className="flex flex-col gap-6 items-center justify-center">
          {/* Chess Board - Full Width */}
          <Card className="w-full max-w-2xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <div className="aspect-square w-full">
                <Chessboard
                  id="chess-board"
                  position={gamePosition}
                  onSquareClick={onSquareClick}
                  onSquareRightClick={onSquareRightClick}
                  onPromotionPieceSelect={onPromotionPieceSelect}
                  customBoardStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  customSquareStyles={{
                    ...moveSquares,
                    ...optionSquares,
                    ...rightClickedSquares,
                  }}
                  customLightSquareStyle={{ backgroundColor: "#f0f0f0" }}
                  customDarkSquareStyle={{ backgroundColor: "#333333" }}
                  promotionToSquare={moveTo}
                  showPromotionDialog={showPromotionDialog}
                  boardWidth={Math.min(600, typeof window !== "undefined" ? window.innerWidth - 100 : 600)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Info Panel - Below Board */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Game Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={getStatusColor() as any} className="text-sm px-3 py-1 w-full justify-center">
                  {getGameStatus()}
                </Badge>
              </CardContent>
            </Card>

            {/* Current Player */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Turn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${
                      game.turn() === "w" ? "bg-white border-slate-300" : "bg-slate-800 border-slate-600"
                    }`}
                  />
                  <span className="font-medium text-lg">{currentPlayer}</span>
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Game Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={resetGame} className="w-full" variant="outline" size="lg">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Game Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Moves:</span>
                  <span className="font-medium">{Math.ceil(game.history().length / 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">In Check:</span>
                  <span className="font-medium">{isInCheck ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Game Over:</span>
                  <span className="font-medium">{isCheckmate || isStalemate || isDraw ? "Yes" : "No"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions - Full Width */}
          <Card className="w-full max-w-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p>• Click a piece to see possible moves</p>
                  <p>• Click destination square to move</p>
                </div>
                <div className="space-y-2">
                  <p>• Right-click squares to highlight them</p>
                  <p>• Take turns on the same device</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
