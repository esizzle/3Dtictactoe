class GameBoard:
    def __init__(self):
        # define a 3x3x3 array to be used as the game board
        self.gameboard = [[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                          [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                          [[0, 0, 0], [0, 0, 0], [0, 0, 0]],]

    # add either an '1' or '-1' at an (x,y) position
    def add_obj(self, obj: int, position: tuple):
        self.gameboard[0][position[0]][position[1]] = obj

        # let object fall to the lowest possible location
        if self.gameboard[1][position[0]][position[1]] == 0:
            self.gameboard[0][position[0]][position[1]] = 0
            self.gameboard[1][position[0]][position[1]] = obj
            if self.gameboard[2][position[0]][position[1]] == 0:
                self.gameboard[1][position[0]][position[1]] = 0
                self.gameboard[2][position[0]][position[1]] = obj

    def check_win(self):

        # check z axis
        for z in range(3):
            # check 3 rows
            for y in range(3):
                if self.gameboard[z][y] == [1,1,1]:
                    print("p1 wins!")
                    return True
                elif self.gameboard[z][y] == [10,10,10]:
                    print("p2 wins!")
                    return True


            # check 3 columns
            for x in range(3):
                if self.gameboard[z][0][x] + self.gameboard[z][1][x] + self.gameboard[z][2][x] == 3:
                    print("p1 wins!")
                    return True
                elif self.gameboard[z][0][x] + self.gameboard[z][1][x] + self.gameboard[z][2][x] == 30:
                    print("p2 wins!")
                    return True

            # check 2 diagonals
                if self.gameboard[z][0][0] + self.gameboard[z][1][1] + self.gameboard[z][2][2] == 3:
                    print("p1 wins!")
                    return True
                elif self.gameboard[z][0][0] + self.gameboard[z][1][1] + self.gameboard[z][2][2] == 30:
                    print("p2 wins!")
                    return True
                elif self.gameboard[z][2][0] + self.gameboard[z][1][1] + self.gameboard[z][0][2] == 3:
                    print("p1 wins!")
                    return True
                elif self.gameboard[z][2][0] + self.gameboard[z][1][1] + self.gameboard[z][0][2] == 30:
                    print("p2 wins!")
                    return True

        # check y axis
        for y in range(3):
            # check across z = 0,1,2
            for x in range(3):
                if self.gameboard[0][y][x] + self.gameboard[1][y][x] + self.gameboard[2][y][x] == 3:
                    print("p1 wins!")
                    return True
                if self.gameboard[0][y][x] + self.gameboard[1][y][x] + self.gameboard[2][y][x] == 30:
                    print("p2 wins!")
                    return True

            # check diagonals
            if self.gameboard[0][y][0] + self.gameboard[1][y][1] + self.gameboard[2][y][2] == 3:
                print("p1 wins!")
                return True
            elif self.gameboard[0][y][0] + self.gameboard[1][y][1] + self.gameboard[2][y][2] == 30:
                print("p2 wins!")
                return True
            elif self.gameboard[0][y][2] + self.gameboard[1][y][1] + self.gameboard[2][y][0] == 3:
                print("p1 wins!")
                return True
            elif self.gameboard[0][y][2] + self.gameboard[1][y][1] + self.gameboard[2][y][0] == 30:
                print("p2 wins!")
                return True

        # check x axis (diagonals because all other cases are already covered)
        for x in range(3):
            if self.gameboard[0][0][x] + self.gameboard[1][1][x] + self.gameboard[2][2][x] == 3:
                print("p1 wins!")
                return True
            elif self.gameboard[0][0][x] + self.gameboard[1][1][x] + self.gameboard[2][2][x] == 30:
                print("p2 wins!")
                return True
            elif self.gameboard[0][2][x] + self.gameboard[1][1][x] + self.gameboard[2][0][x] == 3:
                print("p1 wins!")
                return True
            elif self.gameboard[0][2][x] + self.gameboard[1][1][x] + self.gameboard[2][0][x] == 30:
                print("p2 wins!")
                return True

        # check 4 remaining conditions
        if self.gameboard[0][0][0] + self.gameboard[1][1][1] + self.gameboard [2][2][2] == 3:
            print("p1 wins!")
            return True
        elif self.gameboard[0][0][0] + self.gameboard[1][1][1] + self.gameboard [2][2][2] == 30:
            print("p2 wins!")
            return True
        elif self.gameboard[0][2][2] + self.gameboard[1][1][1] + self.gameboard [2][0][0] == 3:
            print("p1 wins!")
            return True
        elif self.gameboard[0][2][2] + self.gameboard[1][1][1] + self.gameboard [2][0][0] == 30:
            print("p2 wins!")
            return True
        elif self.gameboard[0][0][2] + self.gameboard[1][1][1] + self.gameboard [2][2][0] == 3:
            print("p1 wins!")
            return True
        elif self.gameboard[0][0][2] + self.gameboard[1][1][1] + self.gameboard [2][2][0] == 30:
            print("p2 wins!")
            return True
        elif self.gameboard[0][2][0] + self.gameboard[1][1][1] + self.gameboard [2][0][2] == 3:
            print("p1 wins!")
            return True
        elif self.gameboard[0][2][0] + self.gameboard[1][1][1] + self.gameboard [2][0][2] == 30:
            print("p2 wins!")
            return True





    def print_board(self):
        # prints the board into 3 tic-tac-toe boards on top of each other
        # board 1
        print("-----")

        for y in range(0,3):
            print(self.gameboard[0][y][0], self.gameboard[0][y][1], self.gameboard[0][y][2])

        print("-----")

        # board 2
        for y in range(0, 3):
            print(self.gameboard[1][y][0], self.gameboard[1][y][1], self.gameboard[1][y][2])

        print("-----")

        # board 3
        for y in range(0, 3):
            print(self.gameboard[2][y][0], self.gameboard[2][y][1], self.gameboard[2][y][2])

        print("-----")


if __name__ == "__main__":
    game = GameBoard()
    game.add_obj(1, (0,0))
    game.print_board()
    game.check_win()
    game.add_obj(10, (0,1))
    game.print_board()
    game.check_win()
    game.add_obj(1, (0,1))
    game.print_board()
    game.check_win()
    game.add_obj(10, (0, 2))
    game.print_board()
    game.check_win()
    game.add_obj(1, (0,2))
    game.print_board()
    game.check_win()
    game.add_obj(10, (1, 1))
    game.print_board()
    game.check_win()
    game.add_obj(1, (0, 2))
    game.print_board()
    game.check_win()




